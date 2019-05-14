var spicedPg = require("spiced-pg");

var db;
const { localdataBase } = require("../secret");
db = spicedPg(localdataBase());

exports.createUser = function createUser(first, last, email, passw) {
    let q = `INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING id`;
    let params = [first, last, email, passw];
    return db.query(q, params);
};

exports.createsubUser = function createsubUser(first, passw, type, userid) {
    let q = `INSERT INTO subusers (firstname, password, type, userid) VALUES ($1, $2, $3, $4) RETURNING id`;
    let params = [first, passw, type, userid];
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
    let q = `SELECT firstname, password, type, id FROM subusers WHERE userid=$1`;
    let params = [id];
    return db.query(q, params);
};

exports.getsubuser = function getsubuser(id) {
    let q = `SELECT firstname, password, type, id FROM subusers WHERE id=$1`;
    let params = [id];
    return db.query(q, params);
};
