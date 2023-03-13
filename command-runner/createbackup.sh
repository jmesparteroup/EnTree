#!/bin/bash

# backup the current database
echo "backing up database"
PGPASSWORD=password pg_dump -h localhost -p 5432 -U root -d entree > ./data.sql
echo "finished backing up database"

