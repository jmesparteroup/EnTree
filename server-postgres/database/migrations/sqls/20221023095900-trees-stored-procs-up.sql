/* Replace with your SQL commands */

-- Stored procedure for creating a tree

CREATE OR REPLACE FUNCTION createTree(
    name VARCHAR(255),
    description VARCHAR(255),
    location POINT,
    userId VARCHAR(32)
) RETURNS VOID AS $$
BEGIN
    INSERT INTO trees (name, description, location, userId, createdAt)
    VALUES (name, description, location, userId, EXTRACT(EPOCH FROM NOW()));
END;