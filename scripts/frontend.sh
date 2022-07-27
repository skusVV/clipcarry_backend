cd ../

sudo rm -r clipcarry_landing

git clone https://github.com/skusVV/clipcarry_landing.git

sed -i 's/http:\/\/localhost:3001/https:\/\/clipcarry.com/' ./clipcarry_landing/src/constants.ts
sed -i 's/http:\/\/localhost:3000/https:\/\/clipcarry.com/' ./clipcarry_landing/src/constants.ts

#cat ./clipcarry_landing/src/constants.ts
pm2 stop clipcarry_landing

cd clipcarry_landing
npm ci
npm run build

pm2 start npm --name "clipcarry_landing" -- start

#../
