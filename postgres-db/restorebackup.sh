#!/bin/bash

# run psql script to import data 
echo "importing data"
PGPASSWORD=password psql -h localhost -p 5432 -U root -d entree < ./data.sql
echo "finished importing data"