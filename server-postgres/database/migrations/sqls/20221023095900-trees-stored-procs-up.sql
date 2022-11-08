/* Replace with your SQL commands */
-- function to insert a tree
-- CREATE
-- OR REPLACE PROCEDURE create_tree(
--     IN p_description VARCHAR(255),
--     IN p_createdAt BIGINT,
--     IN p_location VARCHAR(255),
--     IN p_userId VARCHAR(32)
-- ) language plpgsql as $$ BEGIN
-- INSERT INTO
--     trees (
--         description,
--         "createdAt",
--         location,
--         "userId"
--     )
-- VALUES
--     (
--         p_description,
--         p_createdAt,
--         ST_GeomFromText(p_location), 
--         p_userId
--     );

-- END;$$;

CREATE OR REPLACE FUNCTION create_tree(
    IN p_description VARCHAR(255),
    IN p_createdAt BIGINT,
    IN p_location VARCHAR(255),
    IN p_userId VARCHAR(32)
<<<<<<< Updated upstream
) language plpgsql as $$ BEGIN
INSERT INTO
    trees (
        description,
        "createdAt",
        location,
        "userId"
    )
VALUES
    (
        p_description,
        p_createdAt,
        ST_GeogFromText(p_location), 
        p_userId
    );
=======
) RETURNS void AS $$

BEGIN
    INSERT INTO
        trees (
            description,
            "createdAt",
            location,
            "userId"
        )
    VALUES
        (
            p_description,
            p_createdAt,
            ST_GeomFromText(p_location), 
            p_userId
        );
END;
$$ LANGUAGE plpgsql;
>>>>>>> Stashed changes


-- Stored procedure for getting a tree
CREATE
<<<<<<< Updated upstream
OR REPLACE FUNCTION get_tree(
    IN p_treeId INT
) 
RETURNS setof trees
language plpgsql 
as 
$$ 
BEGIN
    RETURN QUERY
    SELECT *
    FROM trees
    WHERE trees."treeId" = p_treeId;
END;$$;

-- Stored procedure for getting all trees
-- CREATE
-- OR REPLACE PROCEDURE get_all_trees() language plpgsql as $$ BEGIN
-- SELECT
--     *
-- FROM
--     trees;
=======
OR REPLACE PROCEDURE get_tree(
    IN p_treeId INT,
    OUT result JSON
) language plpgsql as $$ BEGIN
SELECT
    *
FROM
    trees
WHERE
    treeId = p_treeId;


>>>>>>> Stashed changes

-- END;$$;

<<<<<<< Updated upstream
-- Stored procedure for updating a tree
CREATE
OR REPLACE PROCEDURE update_tree(
    IN p_description VARCHAR(255),
    IN p_createdAt BIGINT,
    IN p_location VARCHAR(255),
    IN p_userId VARCHAR(32)
) language plpgsql as $$ BEGIN
UPDATE
    trees
SET
    description = COALESCE(p_description, description),
    "createdAt" = COALESCE(p_createdAt, "createdAt"),
    location = COALESCE(ST_GeogFromText(p_location), location),
    "userId" = COALESCE(p_userId, "userId")
WHERE
    trees."treeId" = p_treeId;
=======
-- -- Stored procedure for getting all trees
-- CREATE
-- OR REPLACE PROCEDURE get_all_trees(INOUT _val text DEFAULT null) language plpgsql as $$ BEGIN
-- SELECT
--     *
-- FROM
--     trees INTO _val
>>>>>>> Stashed changes

-- END;$$;

<<<<<<< Updated upstream
-- Stored procedure for deleting a tree
CREATE
OR REPLACE PROCEDURE delete_tree(
    IN p_treeId INT
) language plpgsql as $$ BEGIN
DELETE FROM
    trees
WHERE
    trees."treeId" = p_treeId;
=======
-- -- Stored procedure for updating a tree
-- CREATE
-- OR REPLACE PROCEDURE update_tree(
--     IN p_description VARCHAR(255),
--     IN p_createdAt BIGINT,
--     IN p_location VARCHAR(255),
--     IN p_userId VARCHAR(32)
-- ) language plpgsql as $$ BEGIN
-- UPDATE
--     trees
-- SET
--     description = COALESCE(p_description, description),
--     "createdAt" = COALESCE(p_createdAt, "createdAt"),
--     location = COALESCE(ST_GeomFromText(p_location), location),
--     "userId" = COALESCE(p_userId, "userId")
-- WHERE
--     treeId = p_treeId;
>>>>>>> Stashed changes

-- END;$$;

<<<<<<< Updated upstream
-- Stored procedure for getting trees by proximity
CREATE OR REPLACE FUNCTION get_trees_by_proximity(
    IN p_location VARCHAR(255),
    IN p_distance INT
) 
RETURNS SETOF trees
LANGUAGE plpgsql 
as $$ 
BEGIN
    RETURN QUERY
    SELECT *
    FROM trees
    WHERE
        ST_DWithin(
            trees.location,
            p_location::geography,
            p_distance
        );
END;
$$;

-- Create function to get all trees
CREATE OR REPLACE FUNCTION get_all_trees()
RETURNS SETOF trees
LANGUAGE plpgsql
as $$
BEGIN
    RETURN QUERY
    SELECT * FROM trees;
END;
$$;
=======
-- -- Stored procedure for deleting a tree
-- CREATE
-- OR REPLACE PROCEDURE delete_tree(
--     IN p_treeId INT
-- ) language plpgsql as $$ BEGIN
-- DELETE FROM
--     trees
-- WHERE
--     treeId = p_treeId;

-- END;$$;

-- -- Stored procedure for getting trees by proximity
-- CREATE
-- OR REPLACE PROCEDURE get_trees_by_proximity(
--     IN p_location VARCHAR(255),
--     IN p_distance INT
-- ) language plpgsql as $$ BEGIN
-- SELECT
--     *
-- FROM
--     trees
-- WHERE
--     ST_DWithin(
--         trees.location,
--         ST_GeomFromText(p_location),
--         p_distance
--     );

-- END;$$;
>>>>>>> Stashed changes
