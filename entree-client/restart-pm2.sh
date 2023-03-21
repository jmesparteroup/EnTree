pm2 delete entree-client-pm2 &&
npm run build &&
pm2 start npm --name entree-client-pm2 -- start