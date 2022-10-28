/* Replace with your SQL commands */
-- CREATE PROCEDURE FOR INSERTING USERS
CREATE
OR REPLACE PROCEDURE insert_user(
    IN p_userId VARCHAR(32),
    IN p_email VARCHAR(255),
    IN p_password VARCHAR(255),
    IN p_name VARCHAR(255),
    IN p_createdAt BIGINT,
    IN p_updatedAt BIGINT
) LANGUAGE plpgsql AS $ $ BEGIN
INSERT INTO
    users (
        "userId",
        email,
        password,
        name,
        "createdAt",
        "updatedAt"
    )
VALUES
    (
        p_userId,
        p_email,
        p_password,
        p_name,
        p_createdAt,
        p_updatedAt
    );

END;

$ $;

-- CREATE PROCEDURE FOR GETTING USERS
CREATE
OR REPLACE PROCEDURE get_user(IN p_userId VARCHAR(32)) LANGUAGE plpgsql AS $ $ BEGIN
SELECT
    *
FROM
    users
WHERE
    userId = p_userId;

END;

$ $;

-- CREATE PROCEDURE FOR GETTING ALL USERS
CREATE
OR REPLACE PROCEDURE get_all_users() LANGUAGE plpgsql AS $ $ BEGIN
SELECT
    *
FROM
    users;

END;

$ $;

-- CREATE PROCEDURE FOR UPDATING USERS USING COALESCE
CREATE
OR REPLACE PROCEDURE update_user(
    IN p_userId VARCHAR(32),
    IN p_email VARCHAR(255),
    IN p_password VARCHAR(255),
    IN p_name VARCHAR(255),
    IN p_createdAt BIGINT,
    IN p_updatedAt BIGINT
) LANGUAGE plpgsql AS $ $ BEGIN
UPDATE
    users
SET
    email = COALESCE(p_email, email),
    password = COALESCE(p_password, password),
    name = COALESCE(p_name, name),
    "createdAt" = COALESCE(p_createdAt, "createdAt"),
    "updatedAt" = COALESCE(p_updatedAt, "updatedAt")
WHERE
    userId = p_userId;

END;

$ $;

-- CREATE PROCEDURE FOR DELETING USERS
CREATE
OR REPLACE PROCEDURE delete_user(IN p_userId VARCHAR(32)) LANGUAGE plpgsql AS $ $ BEGIN
DELETE FROM
    users
WHERE
    userId = p_userId;

END;

$ $;

-- Path: server-postgres/database/migrations/sqls/20221023095909-users-stored-procs-down.sql