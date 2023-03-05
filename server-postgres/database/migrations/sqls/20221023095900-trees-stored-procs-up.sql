CREATE OR REPLACE PROCEDURE update_city_of_tree(
    IN p_treeId VARCHAR(16)
) LANGUAGE plpgsql as $$
BEGIN
    UPDATE "trees"
    SET "cityName" = temp."cityName"
    FROM (
        SELECT "cityPolygons"."cityName"
        FROM "trees" join "cityPolygons"
        ON ST_Intersects("trees"."location", "cityPolygons"."polygon")
        WHERE "trees"."treeId" = p_treeId
    ) as temp
    WHERE "trees"."treeId" = p_treeId;
END; $$;

CREATE OR REPLACE PROCEDURE update_city_of_trees()
LANGUAGE plpgsql as $$
DECLARE 
	_cursor CURSOR FOR SELECT "treeId" FROM "trees";
	_tempid	VARCHAR(16);
BEGIN
	OPEN _cursor;
	LOOP
	FETCH _cursor INTO _tempid;
	EXIT WHEN NOT FOUND;
	
	CALL update_city_of_tree(_tempid);
	END LOOP;
	CLOSE _cursor;
END; $$;

-- Stored procedure for creating a tree
CREATE OR REPLACE PROCEDURE create_tree(
    IN p_treeId VARCHAR(16),
    IN p_description VARCHAR(255),
    IN p_createdAt BIGINT,
    IN p_location VARCHAR(255),
    IN p_userId VARCHAR(32)
) LANGUAGE plpgsql AS $$ 
BEGIN
    INSERT INTO trees (
        "treeId",
        "description",
        "createdAt",
        "location",
        "userId",
        "flagged",
        "cityName"
    ) VALUES (
        p_treeId,
        p_description,
        p_createdAt,
        ST_GeomFromText(p_location, 4326), 
        p_userId,
        FALSE,
        ''
    );

    CALL update_city_of_tree(p_treeId);
END; $$;

-- Stored procedure for getting a tree
CREATE OR REPLACE FUNCTION get_tree(
    IN p_treeId VARCHAR(16)
) 
RETURNS setof trees
LANGUAGE plpgsql AS $$ 
BEGIN
    RETURN QUERY
    SELECT *
    FROM trees
    WHERE trees."treeId" = p_treeId;
END; $$;

-- Stored procedure for updating a tree
CREATE OR REPLACE PROCEDURE update_tree(
    IN p_treeId VARCHAR(16),
    IN p_description VARCHAR(255),
    IN p_flagged BOOLEAN
) LANGUAGE plpgsql AS $$ BEGIN
    UPDATE trees
    SET
        "description" = COALESCE(p_description, "description"),
        "createdAt" = COALESCE(p_createdAt, "createdAt"),
        "flagged" = COALESCE(p_flagged, "flagged")
    WHERE trees."treeId" = p_treeId;
END; $$;

-- Stored procedure for deleting a tree
CREATE
OR REPLACE PROCEDURE delete_tree(
    IN p_treeId VARCHAR(16)
) LANGUAGE plpgsql AS $$ BEGIN
    DELETE FROM
        trees
    WHERE
        trees."treeId" = p_treeId;
END; $$;

-- Stored procedure for getting trees by proximity
CREATE OR REPLACE FUNCTION get_trees_by_proximity(
    IN p_longitude DECIMAL,
    IN p_latitude DECIMAL,
    IN p_distance INT
) 
RETURNS table (j json)
LANGUAGE plpgsql AS $$ BEGIN
    RETURN QUERY
    SELECT json_agg(json_build_object(        
        'treeId', trees."treeId",
        'description', trees."description",
        'createdAt', trees."createdAt",
        'location', ST_AsText(trees."location"),
        'userId', trees."userId",
        'flagged', trees."flagged",
        'cityName', trees."cityName"
    )) j
    FROM trees
    WHERE
        ST_DWithin(
            trees.location::geography,
            ST_SetSRID(ST_MakePoint(p_longitude, p_latitude),4326)::geography,
            p_distance
        );
END; $$;

CREATE OR REPLACE FUNCTION get_all_trees()
RETURNS table (j json)
LANGUAGE plpgsql as $$ BEGIN
    RETURN QUERY
    SELECT json_agg(json_build_object(
        'treeId', trees."treeId",
        'description', trees."description",
        'createdAt', trees."createdAt",
        'location', ST_AsText(trees."location"),
        'userId', trees."userId",
        'cityName', trees."cityName"
    )) j 
    FROM trees;
END; $$;

CREATE OR REPLACE FUNCTION get_trees_by_city(
    IN p_city VARCHAR(255)
)
RETURNS table (c BIGINT)
LANGUAGE plpgsql as $$ BEGIN
    RETURN QUERY
    SELECT COUNT(*) as c
    FROM "trees" join "cityPolygons"
	ON ST_Intersects("trees".location,"cityPolygons".polygon)
    WHERE "cityPolygons"."cityName" = p_city;
END; $$;