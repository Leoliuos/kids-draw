DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(250) NOT NULL,
    lastname VARCHAR(250) NOT NULL,
    email VARCHAR(250) UNIQUE NOT NULL,
    password VARCHAR(60) NOT NULL
);

DROP TABLE IF EXISTS subusers CASCADE;

CREATE TABLE subusers(
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(250) NOT NULL,
    password VARCHAR(60),
    type INTEGER,
    icon INTEGER,
    imageskey VARCHAR(20),
    friendshipkey VARCHAR(30) UNIQUE,
    picindex INTEGER,
    userid INTEGER REFERENCES users(id) NOT NULL
);

DROP TABLE IF EXISTS friendships;

CREATE TABLE friendships(
    id SERIAL PRIMARY KEY,
    requesterid INTEGER NOT NULL,
    password VARCHAR(60) NOT NULL,
    receiverid INTEGER,
    accepted BOOLEAN,
    uniqcode VARCHAR(250) UNIQUE
);
