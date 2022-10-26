/* Replace with your SQL commands */
-- Stored procedure for creating a tree
CREATE
OR REPLACE PROCEDURE create_tree(
    IN p_name VARCHAR(255),
    IN p_description VARCHAR(255),
    IN p_createdAt BIGINT,
    IN p_location VARCHAR(255),
    IN p_userId VARCHAR(32)
) language plpgsql as $$ BEGIN
INSERT INTO
    trees (
        name,
        description,
        "createdAt",
        location,
        "userId"
    )
VALUES
    (
        p_name,
        p_description,
        p_createdAt,
        ST_GeomFromText(p_location),
        p_userId
    );

END;$$;

-- Stored procedure for getting a tree
CREATE
OR REPLACE PROCEDURE get_tree(
    IN p_treeId INT
) language plpgsql as $$ BEGIN
SELECT
    *
FROM
    trees
WHERE
    treeId = p_treeId;

END;$$;

-- Stored procedure for getting all trees
CREATE
OR REPLACE PROCEDURE get_all_trees() language plpgsql as $$ BEGIN
SELECT
    *
FROM
    trees;

END;$$;

-- Stored procedure for updating a tree
CREATE
OR REPLACE PROCEDURE update_tree(
    IN p_treeId INT,
    IN p_name VARCHAR(255),
    IN p_description VARCHAR(255),
    IN p_createdAt BIGINT,
    IN p_location VARCHAR(255),
    IN p_userId VARCHAR(32)
) language plpgsql as $$ BEGIN
UPDATE
    trees
SET
    name = COALESCE(p_name),
    description = COALESCE(p_description),
    "createdAt" = COALESCE("createdAt", p_createdAt),
    location = COALESCE(location,ST_GeomFromText(p_location)),
    "userId" = COALESCE("userId", p_userId)
WHERE
    treeId = p_treeId;

END;$$;

-- Stored procedure for deleting a tree
CREATE
OR REPLACE PROCEDURE delete_tree(
    IN p_treeId INT
) language plpgsql as $$ BEGIN
DELETE FROM
    trees
WHERE
    treeId = p_treeId;

END;$$;

-- Stored procedure for getting trees by proximity
CREATE
OR REPLACE PROCEDURE get_trees_by_proximity(
    IN p_location VARCHAR(255),
    IN p_distance INT
) language plpgsql as $$ BEGIN
SELECT
    *
FROM
    trees
WHERE
    ST_DWithin(
        trees.location,
        ST_GeomFromText(p_location),
        p_distance
    );

END;$$;