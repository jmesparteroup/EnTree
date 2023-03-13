/* Replace with your SQL commands */
CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- TABLE FOR USERS
CREATE TABLE IF NOT EXISTS "users" (
    "userId" VARCHAR(32) UNIQUE NOT NULL,
    "username" VARCHAR(255)UNIQUE NOT NULL,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "age" INT NOT NULL,
    "mobileNumber" VARCHAR(255) NOT NULL,
    "role" VARCHAR(255) NOT NULL,
    "createdAt" BIGINT NOT NULL,
    "updatedAt" BIGINT NOT NULL,
    PRIMARY KEY ("userId")
);

-- TABLE FOR TREES
CREATE TABLE IF NOT EXISTS "trees" (
    "treeId" VARCHAR(16) UNIQUE NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "createdAt" BIGINT NOT NULL,
    "location" GEOMETRY(POINT,4326) NOT NULL,
    "userId" VARCHAR(32) NOT NULL,
    "flagged" BOOLEAN NOT NULL,
    "cityName" VARCHAR(255) NOT NULL,
    PRIMARY KEY ("treeId")
);

-- TABLE FOR CITY POLYGONS
CREATE TABLE IF NOT EXISTS "cityPolygons" (
    "cityId" VARCHAR(16) UNIQUE NOT NULL,
    "cityName" VARCHAR(255) NOT NULL,
    "polygon" GEOMETRY(POLYGON,4326) NOT NULL,
    PRIMARY KEY ("cityId")
);


-- TABLE FOR USER FLAGS
CREATE TABLE IF NOT EXISTS "flags" (
    "flagId" VARCHAR(16) UNIQUE NOT NULL,
    "treeId" VARCHAR(16) NOT NULL,
    "userId" VARCHAR(32) NOT NULL,
    PRIMARY KEY ("flagId")
);