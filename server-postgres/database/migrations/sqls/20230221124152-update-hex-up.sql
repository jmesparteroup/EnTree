CALL tile_map('hexmap50', 50);
CALL tile_map('hexmap150', 150);
CALL tile_map('hexmap300', 300);
CALL tile_map('hexmap500', 500);

CREATE OR REPLACE FUNCTION get_trees_on_hex_50(
    IN p_longitude DECIMAL,
    IN p_latitude DECIMAL
)
RETURNS table (
    hexid VARCHAR(16),
    treecount BIGINT,
    geom TEXT,
	cities TEXT
)
LANGUAGE plpgsql
as $$
BEGIN
    RETURN QUERY
    SELECT "hexmap50"."hexid", "hexmap50"."treecount", ST_AsText("hexmap50"."geom"), "hexmap50"."cities"
    FROM "hexmap50"
    WHERE
        ST_DWithin(
            "hexmap50"."geom"::geography,
            ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326)::geography,
            500
        )
    GROUP BY "hexmap50"."geom", "hexmap50"."hexid";
END;
$$;

CREATE OR REPLACE FUNCTION get_trees_on_hex_150(
    IN p_longitude DECIMAL,
    IN p_latitude DECIMAL
)
RETURNS table (
    hexid VARCHAR(16),
    treecount BIGINT,
    geom TEXT,
	cities TEXT
)
LANGUAGE plpgsql
as $$
BEGIN
    RETURN QUERY
    SELECT "hexmap150"."hexid", "hexmap150"."treecount", ST_AsText("hexmap150"."geom"), "hexmap150"."cities"
    FROM "hexmap150"
    WHERE
        ST_DWithin(
            "hexmap150"."geom"::geography,
            ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326)::geography,
            900
        )
    GROUP BY "hexmap150"."geom", "hexmap150"."hexid";
END;
$$;

CREATE OR REPLACE FUNCTION get_trees_on_hex_300(
    IN p_longitude DECIMAL,
    IN p_latitude DECIMAL
)
RETURNS table (
    hexid VARCHAR(16),
    treecount BIGINT,
    geom TEXT,
	cities TEXT
)
LANGUAGE plpgsql
as $$
BEGIN
    RETURN QUERY
    SELECT "hexmap300"."hexid", "hexmap300"."treecount", ST_AsText("hexmap300"."geom"), "hexmap300"."cities"
    FROM "hexmap300"
    WHERE
        ST_DWithin(
            "hexmap300"."geom"::geography,
            ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326)::geography,
            1800
        )
    GROUP BY "hexmap300"."geom", "hexmap300"."hexid";
END;
$$;

CREATE OR REPLACE FUNCTION get_trees_on_hex_500(
    IN p_longitude DECIMAL,
    IN p_latitude DECIMAL
)
RETURNS table (
    hexid VARCHAR(16),
    treecount BIGINT,
    geom TEXT,
	cities TEXT
)
LANGUAGE plpgsql
as $$
BEGIN
    RETURN QUERY
    SELECT "hexmap500"."hexid", "hexmap500"."treecount", ST_AsText("hexmap500"."geom"), "hexmap500"."cities"
    FROM "hexmap500"
    WHERE
        ST_DWithin(
            "hexmap500"."geom"::geography,
            ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326)::geography,
            4000
        )
    GROUP BY "hexmap500"."geom", "hexmap500"."hexid";
END;
$$;

-- 59, 150, 300, 500
UPDATE "hexmap50" as "h"
SET "treecount" = temp.c
FROM (
	SELECT "hexmap50"."hexid", COUNT("trees"."treeId") as c
	FROM "hexmap50" JOIN "trees"
	ON ST_Intersects("trees"."location", "hexmap50"."geom")
	GROUP BY "hexmap50"."geom", "hexmap50"."hexid"
) as temp
WHERE "h"."hexid" = "temp"."hexid";

UPDATE "hexmap150" as "h"
SET "treecount" = temp.c
FROM (
	SELECT "hexmap150"."hexid", COUNT("trees"."treeId") as c
	FROM "hexmap150" JOIN "trees"
	ON ST_Intersects("trees"."location", "hexmap150"."geom")
	GROUP BY "hexmap150"."geom", "hexmap150"."hexid"
) as temp
WHERE "h"."hexid" = "temp"."hexid";

UPDATE "hexmap300" as "h"
SET "treecount" = temp.c
FROM (
	SELECT "hexmap300"."hexid", COUNT("trees"."treeId") as c
	FROM "hexmap300" JOIN "trees"
	ON ST_Intersects("trees"."location", "hexmap300"."geom")
	GROUP BY "hexmap300"."geom", "hexmap300"."hexid"
) as temp
WHERE "h"."hexid" = "temp"."hexid";

UPDATE "hexmap500" as "h"
SET "treecount" = temp.c
FROM (
	SELECT "hexmap500"."hexid", COUNT("trees"."treeId") as c
	FROM "hexmap500" JOIN "trees"
	ON ST_Intersects("trees"."location", "hexmap500"."geom")
	GROUP BY "hexmap500"."geom", "hexmap500"."hexid"
) as temp
WHERE "h"."hexid" = "temp"."hexid";

CREATE OR REPLACE PROCEDURE updatehex(
	IN p_city TEXT
)
LANGUAGE plpgsql
as $$
BEGIN
	UPDATE "hexmap50"
	SET "cities" = CONCAT("hexmap50"."cities","cityPolygons"."cityName",',')
	FROM "cityPolygons"
	WHERE "cityPolygons"."cityName" = p_city
	AND ST_Intersects("cityPolygons"."polygon", "hexmap50"."geom");
	
	UPDATE "hexmap150"
	SET "cities" = CONCAT("hexmap150"."cities","cityPolygons"."cityName",',')
	FROM "cityPolygons"
	WHERE "cityPolygons"."cityName" = p_city
	AND ST_Intersects("cityPolygons"."polygon", "hexmap150"."geom");
	
	UPDATE "hexmap300"
	SET "cities" = CONCAT("hexmap300"."cities","cityPolygons"."cityName",',')
	FROM "cityPolygons"
	WHERE "cityPolygons"."cityName" = p_city
	AND ST_Intersects("cityPolygons"."polygon", "hexmap300"."geom");
	
	UPDATE "hexmap500"
	SET "cities" = CONCAT("hexmap500"."cities","cityPolygons"."cityName",',')
	FROM "cityPolygons"
	WHERE "cityPolygons"."cityName" = p_city
	AND ST_Intersects("cityPolygons"."polygon", "hexmap500"."geom");
END;
$$;

CALL updatehex('Caloocan');
CALL updatehex('Las Pinas');
CALL updatehex('Makati');
CALL updatehex('Malabon');
CALL updatehex('Mandaluyong');
CALL updatehex('Manila');
CALL updatehex('Marikina');
CALL updatehex('Muntinlupa');
CALL updatehex('Navotas');
CALL updatehex('Paranaque');
CALL updatehex('Pasay');
CALL updatehex('Pasig');
CALL updatehex('Quezon City');
CALL updatehex('San Juan');
CALL updatehex('Taguig');
CALL updatehex('Valenzuela');
CALL updatehex('Pateros');
