# EnTree README

---

## Deploying the app

1. Deploy the container by doing `docker-compose up -d --build`
2. Wait for it to finish building
3. Once it's done building, the website will be available on `localhost:3000`
4. Particularly, the map will be available on `localhost:3000/maps`
5. The server will be available on `localhost:5000`
6. After the images have been built, rebuilding them is not necessary when redeploying the app. Redeploy the container by doing `docker-compose up -d`.


## Specific Instructions

# When encountering "Error: Cannot find module './random'"
1. Run `npm uninstall nanoid`
2. Run `npm install save nanoid@2.1.11`