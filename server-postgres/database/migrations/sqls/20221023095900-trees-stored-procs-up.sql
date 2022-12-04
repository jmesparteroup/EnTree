CREATE OR REPLACE PROCEDURE create_tree(
    IN p_treeId VARCHAR(16),
    IN p_description VARCHAR(255),
    IN p_createdAt BIGINT,
    IN p_location VARCHAR(255),
    IN p_userId VARCHAR(32)
) language plpgsql as $$ BEGIN
INSERT INTO
    trees (
        "treeId",
        "description",
        "createdAt",
        "location",
        "userId"
    )
VALUES
    (
        p_treeId,
        p_description,
        p_createdAt,
        ST_GeomFromText(p_location, 4326), 
        p_userId
    );
END;
$$;

-- Stored procedure for getting a tree
CREATE
OR REPLACE FUNCTION get_tree(
    IN p_treeId VARCHAR(16)
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

-- END;$$;

-- Stored procedure for updating a tree
CREATE
OR REPLACE PROCEDURE update_tree(
    IN p_treeId VARCHAR(16),
    IN p_description VARCHAR(255),
    IN p_createdAt BIGINT,
    IN p_location VARCHAR(255),
    IN p_userId VARCHAR(32)
) language plpgsql as $$ BEGIN
UPDATE
    trees
SET
    "description" = COALESCE(p_description, "description"),
    "createdAt" = COALESCE(p_createdAt, "createdAt"),
    "location" = COALESCE(ST_GeomFromText(p_location, 4326), "location"),
    "userId" = COALESCE(p_userId, "userId")
WHERE
    trees."treeId" = p_treeId;
END;$$;

-- Stored procedure for deleting a tree
CREATE
OR REPLACE PROCEDURE delete_tree(
    IN p_treeId VARCHAR(16)
) language plpgsql as $$ BEGIN
DELETE FROM
    trees
WHERE
    trees."treeId" = p_treeId;
END;
$$;

-- Stored procedure for getting trees by proximity
CREATE OR REPLACE FUNCTION get_trees_by_proximity(
    IN p_longitude DECIMAL,
    IN p_latitude DECIMAL,
    IN p_distance INT
) 
RETURNS table (j json)
LANGUAGE plpgsql 
as $$ 
BEGIN
    RETURN QUERY
    SELECT json_agg(json_build_object(        
        'treeId', trees."treeId",
        'description', trees."description",
        'createdAt', trees."createdAt",
        'location', ST_AsText(trees."location"),
        'userId', trees."userId"
    )) j
    FROM trees
    WHERE
        ST_DWithin(
            trees.location::geography,
            ST_SetSRID(ST_MakePoint(p_longitude, p_latitude),4326)::geography,
            p_distance
        );
END;
$$;

-- Create function to get all trees
-- CREATE OR REPLACE FUNCTION get_all_trees()
-- RETURNS SETOF trees
-- LANGUAGE plpgsql
-- as $$
-- BEGIN
--     RETURN QUERY
--     SELECT * FROM trees;
-- END;
-- $$;

CREATE OR REPLACE FUNCTION get_all_trees()
RETURNS table (j json)
LANGUAGE plpgsql
as $$
BEGIN
    RETURN QUERY
    SELECT json_agg(json_build_object(
        'treeId', trees."treeId",
        'description', trees."description",
        'createdAt', trees."createdAt",
        'location', ST_AsText(trees."location"),
        'userId', trees."userId"
    )) j 
    FROM trees;
END;
$$;

CREATE OR REPLACE FUNCTION get_trees_by_city(
    IN p_city VARCHAR(255)
)
RETURNS table (j json)
LANGUAGE plpgsql
as $$
BEGIN
    RETURN QUERY
    SELECT json_agg(json_build_object(
        'treeId', trees."treeId",
        'description', trees."description",
        'createdAt', trees."createdAt",
        'location', ST_AsText(trees."location"),
        'userId', trees."userId"
    )) j 
    FROM "trees" join "cityPolygons"
	ON ST_Intersects("trees".location,"cityPolygons".polygon)
    WHERE "cityPolygons"."cityName" = p_city;
END;
$$;

CREATE OR REPLACE FUNCTION get_city(
    IN p_city VARCHAR(255)
)
RETURNS table (
	"cityName" VARCHAR(255),
	"polygon" TEXT
)
LANGUAGE plpgsql
as $$
BEGIN
    RETURN QUERY
    SELECT "cityId", ST_AsText("cityPolygons"."polygon") 
    FROM "cityPolygons"
    WHERE "cityPolygons"."cityName" = p_city;
END;
$$;
