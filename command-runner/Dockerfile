# base image (all dockerfiles should have this)
FROM postgres
# set working directory

WORKDIR /command-runner
 
# install dependencies for start.sh
RUN apt-get update

COPY . .


