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
    SELECT "cityPolygons"."cityName", ST_AsText("cityPolygons"."polygon") 
    FROM "cityPolygons"
    WHERE "cityPolygons"."cityName" = p_city;
END;
$$;

-- FUNCTION TO GENERATE RANDOM UID
-- TAKEN FROM https://stackoverflow.com/questions/41970461/how-to-generate-a-random-unique-alphanumeric-id-of-length-n-in-postgres-9-6
CREATE OR REPLACE FUNCTION generate_uid(size INT) RETURNS TEXT AS $$
DECLARE
  characters TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  bytes BYTEA := gen_random_bytes(size);
  l INT := length(characters);
  i INT := 0;
  output TEXT := '';
BEGIN
  WHILE i < size LOOP
    output := output || substr(characters, get_byte(bytes, i) % l + 1, 1);
    i := i + 1;
  END LOOP;
  RETURN output;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- PROCEDURE TO GENERATE POLYGONS 
CREATE OR REPLACE PROCEDURE tile_map(
    IN p_table TEXT,
    IN p_height NUMERIC
)
LANGUAGE plpgsql
as $$
DECLARE 
    _cursor     CURSOR FOR SELECT ST_Transform(polygon,3857) from "cityPolygons";
    _srid       INTEGER := 3857;
    _width      NUMERIC := p_height *0.866;
    _geom       GEOMETRY;
    _hx         GEOMETRY := ST_GeomFromText( 
                    FORMAT('POLYGON((0 0, %s %s, %s %s, %s %s, %s %s, %s %s, 0 0))',
                        (_width *  0.5), (p_height * 0.25),
                        (_width *  0.5), (p_height * 0.75),
                                    0 ,  p_height,
                        (_width * -0.5), (p_height * 0.75),
                        (_width * -0.5), (p_height * 0.25)
                    ), _srid);
BEGIN
    CREATE TEMP TABLE hx_tmp (geom GEOMETRY(POLYGON), hexid VARCHAR(16));
    OPEN _cursor;
    LOOP

    FETCH
        _cursor INTO _geom;
        EXIT WHEN NOT FOUND;

    INSERT INTO hx_tmp
    SELECT
        ST_Translate(_hx, x_series, y_series)::GEOMETRY(POLYGON) geom,
        generate_uid(16)
    FROM
        generate_series(
        (st_xmin(_geom) / _width)::INTEGER * _width - _width,
        (st_xmax(_geom) / _width)::INTEGER * _width + _width,
        _width) x_series,
        generate_series(
        (st_ymin(_geom) / (p_height * 1.5))::INTEGER * (p_height * 1.5) - p_height,
        (st_ymax(_geom) / (p_height * 1.5))::INTEGER * (p_height * 1.5) + p_height,
        p_height * 1.5) y_series
    WHERE
        ST_Intersects(ST_Translate(_hx, x_series, y_series)::GEOMETRY(POLYGON), _geom);

    INSERT INTO hx_tmp
    SELECT 
        ST_Translate(_hx, x_series, y_series)::GEOMETRY(POLYGON) geom,
        generate_uid(16)
    FROM
        generate_series(
        (st_xmin(_geom) / _width)::INTEGER * _width - (_width * 1.5),
        (st_xmax(_geom) / _width)::INTEGER * _width + _width,
        _width) x_series,
        generate_series(
        (st_ymin(_geom) / (p_height * 1.5))::INTEGER * (p_height * 1.5) - (p_height * 1.75),
        (st_ymax(_geom) / (p_height * 1.5))::INTEGER * (p_height * 1.5) + p_height,
        p_height * 1.5) y_series
    WHERE
        ST_Intersects(ST_Translate(_hx, x_series, y_series)::GEOMETRY(POLYGON), _geom);


    END LOOP;
    CLOSE _cursor;

    CREATE INDEX sidx_hx_tmp_geom ON hx_tmp USING GIST (geom);
    EXECUTE 'DROP TABLE IF EXISTS '|| p_table;
    EXECUTE 'CREATE TABLE '|| p_table ||' (geom GEOMETRY(POLYGON, 4326), hexid VARCHAR(16), treecount BIGINT, PRIMARY KEY(hexid))';
    EXECUTE 'INSERT INTO '|| p_table ||' SELECT ST_Transform(geom,4326), hexid, 0 FROM hx_tmp GROUP BY geom, hexid';
    EXECUTE 'CREATE INDEX sidx_'|| p_table ||'_geom ON '|| p_table ||' USING GIST (geom)';
    DROP TABLE IF EXISTS hx_tmp;
END;
$$;

CALL tile_map('hexmap50', 50);
CALL tile_map('hexmap100', 100);
CALL tile_map('hexmap150', 150);
CALL tile_map('hexmap200', 200);
CALL tile_map('hexmap250', 250);
CALL tile_map('hexmap300', 300);
CALL tile_map('hexmap350', 350);
CALL tile_map('hexmap400', 400);
CALL tile_map('hexmap450', 450);
CALL tile_map('hexmap500', 500);

CREATE OR REPLACE FUNCTION get_trees_on_hex_50(
    IN p_longitude DECIMAL,
    IN p_latitude DECIMAL
)
RETURNS table (
    hexid VARCHAR(16),
    treecount BIGINT,
    geom TEXT
)
LANGUAGE plpgsql
as $$
BEGIN
    RETURN QUERY
    SELECT "hexmap50"."hexid", "hexmap50"."treecount", ST_AsText("hexmap50"."geom")
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
    geom TEXT
)
LANGUAGE plpgsql
as $$
BEGIN
    RETURN QUERY
    SELECT "hexmap150"."hexid", "hexmap150"."treecount", ST_AsText("hexmap150"."geom")
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
    geom TEXT
)
LANGUAGE plpgsql
as $$
BEGIN
    RETURN QUERY
    SELECT "hexmap300"."hexid", "hexmap300"."treecount", ST_AsText("hexmap300"."geom")
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
    geom TEXT
)
LANGUAGE plpgsql
as $$
BEGIN
    RETURN QUERY
    SELECT "hexmap500"."hexid", "hexmap500"."treecount", ST_AsText("hexmap500"."geom")
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