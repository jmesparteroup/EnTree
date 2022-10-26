/* Replace with your SQL commands */
-- TABLE FOR USERS
CREATE TABLE IF NOT EXISTS "users" (
    "userId" VARCHAR(32) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "createdAt" BIGINT NOT NULL,
    "updatedAt" BIGINT NOT NULL
);

-- TABLE FOR TREES
CREATE TABLE IF NOT EXISTS "trees" (
    "treeId" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "createdAt" BIGINT NOT NULL,
    --   LOCATION POSTGIS POINT
    "location" GEOMETRY,
    "userId" VARCHAR(32) NOT NULL
);