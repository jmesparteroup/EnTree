/* Replace with your SQL commands */
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
    "treeId" SERIAL PRIMARY KEY,
    "description" VARCHAR(255) NOT NULL,
    "createdAt" BIGINT NOT NULL,
    --   LOCATION POSTGIS POINT
    "location" GEOGRAPHY,
    "userId" VARCHAR(32) NOT NULL
);

-- TABLE FOR CITY POLYGONS
CREATE TABLE IF NOT EXISTS "cityPolygons" (
    "cityId" SERIAL PRIMARY KEY,
    "cityName" VARCHAR(255) NOT NULL,
    --   POLYGON POSTGIS POLYGON
    "polygon" GEOMETRY
);