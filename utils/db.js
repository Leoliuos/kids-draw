var spicedPg = require("spiced-pg");

var db;
const { localdataBase } = require("../secret");
db = spicedPg(process.env.DATABASE_URL || localdataBase());

exports.createUser = function createUser(first, last, email, passw) {
    let q = `INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING id`;
    let params = [first, last, email, passw];
    return db.query(q, params);
};

exports.createsubUser = function createsubUser(
    first,
    passw,
    type,
    userid,
    imageskey,
    friendshipkey
) {
    let q = `INSERT INTO subusers (firstname, password, type, userid, imageskey, friendshipkey, picindex) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`;
    let params = [first, passw, type, userid, imageskey, friendshipkey, 0];
    return db.query(q, params);
};

exports.queryLogin = function queryLogin(email) {
    let q = `SELECT password,id FROM users WHERE lower(email) = lower($1)`;
    let params = [email];
    return db.query(q, params);
};

exports.queryLoginID = function queryLoginID(email) {
    let q = `SELECT id FROM users WHERE lower(email) = lower($1)`;
    let params = [email];
    return db.query(q, params);
};

exports.querysubLogin = function querysubLogin(id) {
    let q = `SELECT password,id FROM users WHERE id = $1`;
    let params = [id];
    return db.query(q, id);
};

exports.getusername = function getusername(id) {
    let q = `SELECT firstname FROM users WHERE id=$1`;
    let params = [id];
    return db.query(q, params);
};

exports.getsubusers = function getsubusers(id) {
    let q = `SELECT firstname, password, type, id, friendshipkey FROM subusers WHERE userid=$1`;
    let params = [id];
    return db.query(q, params);
};

exports.getsubuser = function getsubuser(id) {
    let q = `SELECT firstname, password, type, id FROM subusers WHERE id=$1`;
    let params = [id];
    return db.query(q, params);
};

exports.editsubUser = function editsubUser(first, passw, type, id, origname) {
    let q = `UPDATE subusers SET firstname = $1 , password = $2 , type = $3 WHERE userid=$4 AND firstname=$5 AND NOT type=1 RETURNING id`;
    let params = [first, passw, type, id, origname];
    return db.query(q, params);
};

exports.deletesubUser = function deletesubUser(id, first) {
    let q = `DELETE FROM subusers WHERE userid=$1 AND firstname=$2 AND NOT type=1 RETURNING id`;
    let params = [id, first];
    return db.query(q, params);
};

exports.findsubUserCurrentName = function findsubUserCurrentName(id) {
    let q = `SELECT firstname FROM subusers WHERE id=$1`;
    let params = [id];
    return db.query(q, params);
};

exports.checkifsubUsernameTaken = function checkifsubUsernameTaken(first, id) {
    let q = `SELECT id FROM subusers WHERE firstname=$1 AND userid=$2`;
    let params = [first, id];
    return db.query(q, params);
};

exports.finduserimagekey = function finduserimagekey(id) {
    let q = `SELECT imageskey, picindex FROM subusers WHERE id=$1`;
    let params = [id];
    return db.query(q, params);
};

exports.setimageindex = function setimageindex(picindex, id) {
    let q = `UPDATE subusers SET picindex = $1 WHERE id=$2`;
    let params = [picindex, id];
    return db.query(q, params);
};

// PREPARE FRIENDSHIPS

exports.checkexistingfriendshipkey = function checkexistingfriendshipkey(id) {
    let q = `SELECT id FROM friendships WHERE requesterid=$1`;
    let params = [id];
    return db.query(q, params);
};

exports.makefriendshipkey = function makefriendshipkey(requesterid, password) {
    let q = `INSERT INTO friendships (requesterid, password) VALUES ($1, $2) RETURNING id`;
    let params = [requesterid, password];
    return db.query(q, params);
};

exports.updatefriendshipkey = function updatefriendshipkey(
    password,
    requesterid
) {
    let q = `UPDATE friendships SET password = $1 WHERE requesterid=$2`;
    let params = [password, requesterid];
    return db.query(q, params);
};

exports.finduiid = function finduiid(uid) {
    let q = `SELECT id FROM subusers WHERE friendshipkey=$1`;
    let params = [uid];
    return db.query(q, params);
};

exports.finduipassword = function finduipassword(id) {
    let q = `SELECT password FROM friendships WHERE requesterid=$1`;
    let params = [id];
    return db.query(q, params);
};

// CREATE FRIENDSHIPS
exports.checkexistingconnection = function checkexistingconnection(uniqcode) {
    let q = `SELECT id FROM friendships WHERE uniqcode=$1`;
    let params = [uniqcode];
    return db.query(q, params);
};

exports.makefriendconnection = function makefriendconnection(
    receiverid,
    uniqcode,
    requesterid,
    password,
    receivername,
    requestername
) {
    let q = `INSERT INTO friendships (receiverid, uniqcode, requesterid, password, accepted, receivername, requestername ) VALUES ($1, $2, $3, $4, $5 ,$6, $7) RETURNING id`;
    let params = [
        receiverid,
        uniqcode,
        requesterid,
        password,
        true,
        receivername,
        requestername
    ];
    return db.query(q, params);
};

// GET friendships

exports.queryfriends = function queryfriends(id) {
    let q = `SELECT receiverid, requesterid, receivername, requestername FROM friendships WHERE (requesterid=$1 AND accepted=true) OR (receiverid=$1 AND accepted=true)`;
    let params = [id];
    return db.query(q, params);
};

exports.confirmfriendship = function confirmfriendship(uniq) {
    let q = `SELECT id FROM friendships WHERE uniqcode=$1`;
    let params = [uniq];
    return db.query(q, params);
};

exports.findsubusers = function findsubusers(id) {
    let q = `SELECT firstname FROM subusers WHERE id=$1`;
    let params = [id];
    return db.query(q, params);
};
