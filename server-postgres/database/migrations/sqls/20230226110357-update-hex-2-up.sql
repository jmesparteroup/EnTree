-- Stored Procedure for updating hex tiles when a new tree is entered
CREATE
OR REPLACE PROCEDURE update_hex_add_trees(
    IN p_longitude DECIMAL,
    IN p_latitude DECIMAL
) 
LANGUAGE plpgsql 
as $$ 
BEGIN
    UPDATE "hexmap100"
    SET
        "treecount" = "treecount" + 1
    WHERE
	    ST_Intersects("hexmap100"."geom", ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326));

    UPDATE "hexmap150"
    SET
        "treecount" = "treecount" + 1
    WHERE
	    ST_Intersects("hexmap150"."geom", ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326));

    UPDATE "hexmap300"
    SET
        "treecount" = "treecount" + 1
    WHERE
	    ST_Intersects("hexmap300"."geom", ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326));

    UPDATE "hexmap500"
    SET
        "treecount" = "treecount" + 1
    WHERE
	    ST_Intersects("hexmap500"."geom", ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326));
END;
$$;

-- Calls stored procedure made earlier that updates cities of all trees
CALL update_city_of_trees();