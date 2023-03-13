-- USERS FUNCTIONS

CREATE
OR REPLACE FUNCTION create_user(
    "p_userId" VARCHAR(32),
    "p_username" VARCHAR(255),
    "p_email" VARCHAR(255),
    "p_password" VARCHAR(255),
    "p_firstName" VARCHAR(255),
    "p_lastName" VARCHAR(255),
    "p_age" INT,
    "p_mobileNumber" VARCHAR(255),
    "p_role" VARCHAR(255),
    "p_createdAt" BIGINT,
    "p_updatedAt" BIGINT
) RETURNS VOID AS $$ BEGIN
INSERT INTO
    "users" (
        "userId",
        "username",
        "email",
        "password",
        "firstName",
        "lastName",
        "age",
        "mobileNumber",
        "role",
        "createdAt",
        "updatedAt"
    )
VALUES
    (
        "p_userId",
        "p_username",
        "p_email",
        "p_password",
        "p_firstName",
        "p_lastName",
        "p_age",
        "p_mobileNumber",
        "p_role",
        "p_createdAt",
        "p_updatedAt"
    );

END;

$$ LANGUAGE plpgsql;

CREATE
OR REPLACE FUNCTION update_user(
    "p_userId" VARCHAR(32),
    "p_email" VARCHAR(255),
    "p_password" VARCHAR(255),
    "p_firstName" VARCHAR(255),
    "p_lastName" VARCHAR(255),
    "p_age" INT,
    "p_mobileNumber" VARCHAR(255),
    "p_role" VARCHAR(255),
    "p_createdAt" BIGINT,
    "p_updatedAt" BIGINT
) RETURNS VOID AS $$ -- use coalesece to set the value to the old value if the new value is null
BEGIN
UPDATE
    "users"
SET
    "email" = COALESCE("p_email", "email"),
    "password" = COALESCE("p_password", "password"),
    "firstName" = COALESCE("p_firstName", "firstName"),
    "lastName" = COALESCE("p_lastName", "lastName"),
    "age" = COALESCE("p_age", "age"),
    "mobileNumber" = COALESCE("p_mobileNumber", "mobileNumber"),
    "role" = COALESCE("p_role", "role"),
    "createdAt" = COALESCE("p_createdAt", "createdAt"),
    "updatedAt" = COALESCE("p_updatedAt", "updatedAt")
WHERE
    "userId" = "p_userId";

END;

$$ LANGUAGE plpgsql;

-- GET ALL USERS
CREATE OR REPLACE FUNCTION get_all_users(
) 
RETURNS table (j json) AS $$ BEGIN
RETURN QUERY
SELECT json_agg(json_build_object(
            'userId', users."userId",
            'username', users."username",
            'email', users."email",
            'password', users."password",
            'firstName', users."firstName",
            'lastName', users."lastName",
            'age', users."age",
            'mobileNumber', users."mobileNumber",
            'role', users."role",
            'createdAt', users."createdAt",
            'updatedAt', users."updatedAt"
        )) j from users;
    END;
$$ LANGUAGE plpgsql;

-- get user by id
CREATE OR REPLACE FUNCTION get_user_by_id(
    "p_userId" VARCHAR(32)
) 
RETURNS table (j json) AS $$ BEGIN
RETURN QUERY
SELECT json_agg(json_build_object(
            'userId', users."userId",
            'username', users."username",
            'email', users."email",
            'password', users."password",
            'firstName', users."firstName",
            'lastName', users."lastName",
            'age', users."age",
            'mobileNumber', users."mobileNumber",
            'role', users."role",
            'createdAt', users."createdAt",
            'updatedAt', users."updatedAt"
        )) j from users where "userId" = "p_userId";
    
    END;
$$ LANGUAGE plpgsql;

-- get user by username
CREATE OR REPLACE FUNCTION get_user_by_username(
    "p_username" VARCHAR(255)
)
RETURNS table (j json) AS $$ BEGIN
RETURN QUERY
SELECT json_agg(json_build_object(
            'userId', users."userId",
            'username', users."username",
            'email', users."email",
            'password', users."password",
            'firstName', users."firstName",
            'lastName', users."lastName",
            'age', users."age",
            'mobileNumber', users."mobileNumber",
            'role', users."role",
            'createdAt', users."createdAt",
            'updatedAt', users."updatedAt"
        )) j from users where "username" = "p_username";
    
    END;
$$ LANGUAGE plpgsql;

-- get user by email
CREATE OR REPLACE FUNCTION get_user_by_email(
    "p_email" VARCHAR(255)
)
RETURNS table (j json) AS $$ BEGIN
RETURN QUERY
SELECT json_agg(json_build_object(
            'userId', users."userId",
            'username', users."username",
            'email', users."email",
            'password', users."password",
            'firstName', users."firstName",
            'lastName', users."lastName",
            'age', users."age",
            'mobileNumber', users."mobileNumber",
            'role', users."role",
            'createdAt', users."createdAt",
            'updatedAt', users."updatedAt"
        )) j from users where "email" = "p_email";
    
    END;
$$ LANGUAGE plpgsql;


