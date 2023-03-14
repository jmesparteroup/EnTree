# base image (all dockerfiles should have this)
FROM kartoza/postgis:14-3.2
# set working directory

WORKDIR /postgres
 
# install dependencies for start.sh
RUN apt-get update

COPY . .


