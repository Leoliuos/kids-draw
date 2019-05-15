DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(250) NOT NULL,
    lastname VARCHAR(250) NOT NULL,
    email VARCHAR(250) UNIQUE NOT NULL,
    password VARCHAR(60) NOT NULL
);

DROP TABLE IF EXISTS subusers;

CREATE TABLE subusers(
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(250) NOT NULL,
    password VARCHAR(60),
    type INTEGER,
    icon INTEGER,
    imageskey VARCHAR(20),
    userid INTEGER REFERENCES users(id) NOT NULL
);
