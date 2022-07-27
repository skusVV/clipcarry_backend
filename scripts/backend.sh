# Go folder above
cd ../
# stop serve clipcarry_backend
pm2 stop clipcarry_backend
# remove old backend
sudo rm -r clipcarry_backend
# clone new backend
git clone https://github.com/skusVV/clipcarry_backend.git
# select backend folder
cd clipcarry_backend
# install dependecnies
npm ci

cp ~/.env ~/clipcarry_backend/

# build
npm run build
# run backend
pm2 start dist/index.js --name "clipcarry_backend"
