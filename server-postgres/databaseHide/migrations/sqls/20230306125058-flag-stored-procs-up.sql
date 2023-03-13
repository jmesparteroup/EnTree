/* Replace with your SQL commands */
CREATE OR REPLACE PROCEDURE update_trees_flagged_state(
	IN p_treeId VARCHAR(16)
) LANGUAGE plpgsql as $$
BEGIN	
	UPDATE "trees"
	SET "flagged" = CASE
		WHEN EXISTS (SELECT * FROM "flags" WHERE "treeId" = p_treeId) THEN TRUE
		ELSE FALSE
		END
	WHERE "treeId" = p_treeId;
END; $$;

CREATE OR REPLACE PROCEDURE create_flag(
    IN p_flagId VARCHAR(16),
    IN p_treeId VARCHAR(16),
    IN p_userId VARCHAR(32)
) LANGUAGE plpgsql AS $$ 
BEGIN
    INSERT INTO "flags"
    VALUES (p_flagId, p_treeId, p_userId);
    CALL update_trees_flagged_state(p_treeId);
END; $$;

CREATE OR REPLACE PROCEDURE delete_flag(
	IN p_treeId VARCHAR(16),
	IN p_userId VARCHAR(32)
) LANGUAGE plpgsql as $$
BEGIN
	DELETE FROM "flags"
	WHERE "treeId" = p_treeId
	AND "userId" = p_userId;
    CALL update_trees_flagged_state(p_treeId);
END; $$;

CREATE OR REPLACE PROCEDURE delete_tree_flags(
	IN p_treeId VARCHAR(16)
) LANGUAGE plpgsql as $$
BEGIN
	DELETE FROM "flags"
	WHERE "treeId" = p_treeId;
	UPDATE "trees"
	SET "flagged" = FALSE
	WHERE "treeId" = p_treeId;
END; $$;