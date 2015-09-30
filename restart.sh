
echo "Restarting  SHIPPING"
echo "SHOUT DOWN"
forever  stopall
sudo service redis_6379 stop
cd ~/shipping/server
echo sTOPPING MY-SQL
sudo /etc/init.d/mysql stop

pwd
export SHIPPING_ENV=PROD
echo $SHIPPING_ENV
echo "STARTING REDIS"
sudo service redis_6379 start
echo STARTING MY-SQL
sudo /etc/init.d/mysql start
echo "STARTING SERVER" 
forever start server.js
cd ~/shipping/webapp
echo "STARTING CLIENT"
forever start  app.js

echo "SHIPPING STARTED ..."
