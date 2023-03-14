#!/bin/bash

# wait for db Docker to start up
: ${SLEEP_LENGTH:=2}
 
wait_for() {
 echo Waiting for $1 to listen on $2...
 while ! nc -z $1 $2; do echo sleeping; sleep $SLEEP_LENGTH; done
}
 
for var in "$@"
do
 host=${var%:*}
 port=${var#*:}
 wait_for $host $port
done 

# run psql script to import data 
echo "importing data"
PGPASSWORD=password psql -h localhost -p 5432 -U root -d entree < ./data.sql
echo "finished importing data"