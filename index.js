const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    origins: "localhost:8080 kids-draw.herokuapp.com:*"
});
const compression = require("compression");

const db = require("./utils/db");
const bc = require("./utils/bc");

const csurf = require("csurf");

app.use(express.static("./public"));

const bodyParser = require("body-parser");
app.use(bodyParser.json());

// COOKIE SESSION ////// COOKIE SESSION ////// COOKIE SESSION ////
const cookieSession = require("cookie-session");
const { cookieData } = require("./cookies");
var secret = cookieData();
//secret = process.env.SESSION_SECRET;
const cookieSessionMiddleware = cookieSession({
    maxAge: 1000 * 60 * 60 * 24 * 14,
    secret: secret
});
app.use(cookieSessionMiddleware);

io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
// COOKIE SESSION ////// COOKIE SESSION ////// COOKIE SESSION ////

var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");

const s3 = require("./s3");

const config = require("./config");

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(csurf());

app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use(compression());

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

// LOGIN //// LOGIN //// LOGIN //// LOGIN //

app.get("/login", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/login", async (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        try {
            const logindata = await db.queryLogin(req.body.email);
            if (!logindata.rows[0]) {
                throw "no results for email";
            }
            if (!req.body.passw) {
                throw "no password from user";
            }
            const passw = logindata.rows[0].password;
            const checkpass = bc.checkPassword(req.body.passw, passw);
            const loginId = db.queryLoginID(req.body.email);
            const returnpromises = {
                checkpassProm: await checkpass,
                checkloginProm: await loginId
            };
            if (!returnpromises.checkpassProm) {
                throw "wrong password";
            }
            if (!returnpromises.checkloginProm) {
                throw "no id";
            }
            req.session.userId = returnpromises.checkloginProm.rows[0].id;
            res.send("success");
        } catch (err) {
            res.status(500).send("fail");
        }
    }
});

// REGISTER //// REGISTER //// REGISTER //

app.get("/register", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/register", async (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        try {
            if (
                !req.body.first ||
                !req.body.last ||
                !req.body.email ||
                !req.body.passw ||
                !req.body.masterpassw
            ) {
                throw "empty input field(s)";
            }
            const passw = bc.hashPassword(req.body.passw);
            const masterpassw = bc.hashPassword(req.body.masterpassw);
            const returnpromises = {
                passProm: await passw,
                masterProm: await masterpassw
            };
            const returnid = await db.createUser(
                req.body.first,
                req.body.last,
                req.body.email,
                returnpromises.passProm
            );
            if (!returnid.rows[0].id) {
                throw "createUser not successfull";
            }
            const masteruser = await db.createsubUser(
                req.body.first,
                returnpromises.masterProm,
                1,
                returnid.rows[0].id
            );
            req.session.userId = returnid.rows[0].id;
            req.session.subuserId = masteruser.rows[0].id;
            req.session.subuserType = 1;
            res.send("success");
        } catch (err) {
            res.status(500).send("fail");
        }
    }
});

// SIGNED IN - LOADING SUB USERS LIST

app.get("/subusers", async (req, res) => {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        try {
            const data = [];
            const subuserdata = await db.getsubusers(req.session.userId);
            for (var o = 0; o < subuserdata.rows.length; o++) {
                let passwordtrue = null;
                if (!!subuserdata.rows[o].password) {
                    passwordtrue = true;
                }
                data.push({
                    firstname: subuserdata.rows[o].firstname,
                    password: passwordtrue,
                    id: subuserdata.rows[o].id,
                    type: subuserdata.rows[o].type,
                    friendshipkey: subuserdata.rows[o].friendshipkey
                });
            }
            res.send(data);
        } catch (err) {
            res.status(500).send("server error");
        }
    }
});

app.post("/subregister", async (req, res) => {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        try {
            const subtest = await db.checkifsubUsernameTaken(
                req.body.first,
                req.session.userId
            );
            if (subtest.rows.length === 0) {
                if (!req.body.first) {
                    throw "empty input field";
                }
                let type = 3;
                if (req.body.adult) {
                    type = 2;
                }
                let password = null;
                if (!!req.body.passw) {
                    const passw = await bc.hashPassword(req.body.passw);
                    password = passw;
                }
                const imageskey = uidSafe.sync(10);
                const friendshipkey = uidSafe.sync(15);
                const returnid = await db.createsubUser(
                    req.body.first,
                    password,
                    type,
                    req.session.userId,
                    imageskey,
                    friendshipkey
                );
                if (!returnid.rows[0].id) {
                    throw "createUser not successfull";
                }
                const data = {
                    firstname: req.body.first,
                    password: password,
                    id: returnid.rows[0].id,
                    type: type
                };
                res.send(data);
            } else {
                throw "username exists, choose another one";
            }
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    }
});

app.post("/sublogin", async (req, res) => {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        try {
            if (!req.body.id) {
                throw "user is trying something weird";
            }
            const subid = req.body.id.split("_")[1];
            const querysub = await db.getsubuser(subid);
            if (querysub.rows[0].password == null) {
                req.session.subuserId = subid;
                res.send("success");
            } else {
                const passw = querysub.rows[0].password;
                const checkpass = await bc.checkPassword(req.body.passw, passw);
                if (checkpass === true) {
                    req.session.subuserType = querysub.rows[0].type;
                    req.session.subuserId = subid;
                    res.send({ type: querysub.rows[0].type });
                } else {
                    throw "wrong password";
                }
            }
        } catch (err) {
            res.status(500).send("fail");
        }
    }
});

app.post("/subedit", async (req, res) => {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        if (!!req.body.delete) {
            try {
                const returnid = await db.deletesubUser(
                    req.session.userId,
                    req.body.first
                );
                const data = {
                    firstname: req.body.first,
                    id: returnid.rows[0].id,
                    deleted: true
                };
                res.send(data);
            } catch (err) {
                console.log(err);
                res.status(500).send("fail");
            }
        } else {
            try {
                if (!req.body.first) {
                    throw "empty input field";
                }
                let type = 3;
                if (req.body.adult) {
                    type = 2;
                }
                let password = null;
                if (!!req.body.passw) {
                    const passw = await bc.hashPassword(req.body.passw);
                    password = passw;
                }
                const origname = await db.findsubUserCurrentName(req.body.id);
                // first, passw, type, id, origname
                const returnid = await db.editsubUser(
                    req.body.first,
                    password,
                    type,
                    req.session.userId,
                    origname.rows[0].firstname
                );
                if (!returnid.rows[0].id) {
                    throw "createUser not successfull";
                }
                const data = {
                    firstname: req.body.first,
                    password: password,
                    id: returnid.rows[0].id,
                    type: returnid.rows[0].type
                };
                res.send(data);
            } catch (err) {
                console.log(err);
                res.status(500).send("fail");
            }
        }
    }
});

// SUB TYPE 3 - CHILDREN

app.get("/view", async (req, res) => {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else if (!req.session.subuserId) {
        res.redirect("/");
    } else {
        // child goes to view from draw
    }
});

app.get("/view/images", async (req, res) => {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else if (!req.session.subuserId) {
        res.redirect("/");
    } else {
        // child needs to list images
        const imageskey = await db.finduserimagekey(req.session.subuserId);
        res.send({
            imageskey: imageskey.rows[0].imageskey,
            picindex: imageskey.rows[0].picindex
        });
    }
});

app.get("/draw", async (req, res) => {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        const userimagekey = await db.finduserimagekey(req.session.subuserId);
        db.setimageindex(
            userimagekey.rows[0].picindex + 1,
            req.session.subuserId
        );
        res.redirect(
            "/draw/" +
                userimagekey.rows[0].imageskey +
                "/" +
                (userimagekey.rows[0].picindex + 1)
        );
    }
});

app.get("/draw/*", async (req, res) => {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.set("X-Frame-Options", "deny");
        res.sendFile(__dirname + "/canvas.html");
    }
});

// FRIENDS

app.post("/friends/generatekey", async (req, res) => {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        try {
            const keycheck = await db.checkexistingfriendshipkey(req.body.id);
            const password = await bc.hashPassword(req.body.makepassw);
            if (!!keycheck.rows[0]) {
                const returnid = await db.updatefriendshipkey(
                    password,
                    req.body.id
                );
                res.send("success");
            } else {
                const returnid = await db.makefriendshipkey(
                    req.body.id,
                    password
                );
                if (!returnid.rows[0].id) {
                    throw "createFriendship not successfull";
                }
                res.send("success");
            }
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    }
});

app.post("/friends/enterkey", async (req, res) => {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        try {
            const password = req.body.passw;
            const requesteruid = req.body.uid;
            const keycheck = await db.finduiid(requesteruid);
            if (!keycheck.rows[0]) {
                throw "user not found";
            }
            const passwordcheck = await db.finduipassword(keycheck.rows[0].id);
            const comparepass = await bc.checkPassword(
                password,
                passwordcheck.rows[0].password
            );
            if (!comparepass) {
                throw "password incorrect";
            }
            const uniqcode = ["U" + keycheck.rows[0].id, "U" + req.body.id]
                .sort()
                .join("");
            const exist = await db.checkexistingconnection(uniqcode);
            if (!!exist.rows[0]) {
                throw "already connected.";
            }
            if (req.body.id == keycheck.rows[0].id) {
                throw "users are the same one";
            }
            const reqname = await db.findsubusers(req.body.id);
            const recname = await db.findsubusers(keycheck.rows[0].id);
            // receiverid, uniqcode, requesterid, password, true, receivername, requestername
            const friendconnection = await db.makefriendconnection(
                req.body.id,
                uniqcode,
                keycheck.rows[0].id,
                passwordcheck.rows[0].password,
                recname.rows[0].firstname,
                reqname.rows[0].firstname
            );
            res.send("success");
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    }
});

app.get("/logout", (req, res) => {
    req.session.userId = undefined;
    req.session.subuserId = undefined;
    req.session.subuserType = undefined;
    res.redirect("/welcome");
});

// * //// * //// * //// * //// * //// * //

app.get("*", (req, res) => {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

server.listen(process.env.PORT || 8080, function() {
    console.log("Kids-Draw");
});

// SOCKET IO // SOCKET IO // SOCKET IO // SOCKET IO

let onlineSockets = {};

io.on("connection", function(socket) {
    if (!socket.request.session.subuserId) {
        return socket.disconnect(true);
    }
    // we know this user by the initial handshake
    const userId = socket.request.session.subuserId;

    onlineSockets[userId] = socket.id;

    var friends = [];

    db.queryfriends(userId)
        .then(results => {
            for (var o = 0; o < results.rows.length; o++) {
                if (results.rows[o].receiverid == userId) {
                    if (results.rows[o].requesterid != null) {
                        io.to(onlineSockets[results.rows[o].requesterid]).emit(
                            "userJoined",
                            { id: userId, name: results.rows[o].receivername }
                        );
                        friends.push({
                            id: results.rows[o].requesterid,
                            name: results.rows[o].requestername
                        });
                    }
                } else if (results.rows[o].requesterid == userId) {
                    if (results.rows[o].receiverid != null) {
                        io.to(onlineSockets[results.rows[o].receiverid]).emit(
                            "userJoined",
                            { id: userId, name: results.rows[o].requestername }
                        );
                        friends.push({
                            id: results.rows[o].receiverid,
                            name: results.rows[o].receivername
                        });
                    }
                }
            }
        })
        .then(results => {
            socket.emit("onlineUsers", friends);
        });

    socket.on("disconnect", () => {
        db.queryfriends(userId).then(results => {
            for (var o = 0; o < results.rows.length; o++) {
                if (results.rows[o].receiverid === userId) {
                    if (results.rows[o].requesterid != undefined) {
                        io.to(onlineSockets[results.rows[o].requesterid]).emit(
                            "userLeft",
                            { id: userId, name: results.rows[o].requestername }
                        );
                    }
                } else if (results.rows[o].requesterid === userId) {
                    if (results.rows[o].receiverid != undefined) {
                        io.to(onlineSockets[results.rows[o].receiverid]).emit(
                            "userLeft",
                            { id: userId, name: results.rows[o].receivername }
                        );
                    }
                }
            }
        });
    });

    socket.on("chatMessage", data => {
        const uniqcode = [
            "U" + data.target,
            "U" + socket.request.session.subuserId
        ]
            .sort()
            .join("");
        db.confirmfriendship(uniqcode).then(() => {
            io.to(onlineSockets[data.target]).emit(data);
        });
    });
});
