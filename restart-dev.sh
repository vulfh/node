echo "Restarting  SHIPPING DEVELOPMENT"
echo "SHOUT DOWN"
forever  stopall
cd ~/shipping_dev/server


pwd
export SHIPPING_ENV=PROD
echo $SHIPPING_ENV
echo "STARTING DEVELOPMENT SERVER" 
forever start server.js
cd ~/shipping_dev/webapp
echo "STARTING DEVELOPMENT CLIENT"
forever start  app.js

echo "SHIPPING DEVELOPMENT STARTED ..."
