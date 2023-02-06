# EnTree README

---

## Deploying the application

1. Deploy the container by doing `docker-compose up -d --build`
2. Wait for it to finish building
3. Once it's done building, the website will be available on `localhost:3000`
4. Particularly, the map will be available on `localhost:3000/maps`
5. The server will be available on `localhost:5000`
6. After the images have been built, rebuilding them is not necessary when redeploying the app. Redeploy the container by doing `docker-compose up -d`.


## Specific Instructions

### Restarting the application

1. Don't forget to take down the previous containers: `docker-compose down`.
2. The application can be started by calling `docker-compose up`.

### When encountering "Error: Cannot find module './random'"
1. Go to `server-postgres` directory: `cd server-postgres`.
2. Run: `npm uninstall nanoid`.
3. Run: `npm install save nanoid@2.1.11`.
4. Try rebuilding the application (`docker-compose up --build`). 

## Contact the developers
You may contact the developers using the following emails:
**Joshua** **Espartero:** jmespartero@up.edu.ph
**Christian** **Gelera:** clgelera@up.edu.ph
