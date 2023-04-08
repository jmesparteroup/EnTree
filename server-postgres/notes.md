
<!-- command to create new migration sql -->
node ./node_modules/db-migrate/bin/db-migrate create new-test --sql-file --config ./database/database.json -m ./database/migrations

<!-- steps to implement on mac -->
docker ps
docker exec -it [container id] bash
npm uninstall bcrypt
npm install bcrypt
exit bash

docker-compose.yml: change 5000:5000 to 4999:5000
change localhost:5000 to localhost:4999 in entree-client/services
git update-index --asume-unchanged [files]
files:
    docker-compose.yml
    entree-client/services/userService.js
    entree-client/services/treeService.js
    entree-client/services/hexagonService.js