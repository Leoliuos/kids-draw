const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    origins: "localhost:8080 onceivesetupadreesforherokuhere.herokuapp.com:*"
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

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// * //// * //// * //// * //// * //// * //

app.get("*", (req, res) => {
    res.redirect("/");
});

server.listen(8080, function() {
    console.log("Kids-Draw");
});

// TODO SOCKET IO MESSAGING HERE :
