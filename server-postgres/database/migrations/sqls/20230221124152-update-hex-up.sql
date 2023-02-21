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