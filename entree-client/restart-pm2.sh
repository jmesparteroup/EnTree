pm2 delete entree-client-pm2 &&
npm run build --no-cache &&
pm2 start npm --name entree-client-pm2 -- start
