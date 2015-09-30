var mysql = require('mysql')
var conn=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:''
});
conn.connect();
//conn.query("INSERT INTO shipping.request(DeliveryRemark)VALUES('שחום');",function(err,rows,field){});
conn.query("\
           CALL shipping.InsertRequest (@OwnerUserId:=1\
  ,@PickUpDate:='2014-06-25'\
  ,@PickupCityId:=1\
  ,@PickupHouse:=1\
  ,@PickupStreetId:=-1\
  ,@PickupFloor:=2\
  ,@PickupAppartment:=3\
  ,@PickupStartTime:=NULL\
  ,@PickupEndTime:=NULL\
  ,@PickupRemark:='{PickupRemark}'\
  ,@DeliveryCityId:=1 \
  ,@DeliveryStreetId:=-1\
  ,@DeliveryDate:='2014-06-25'\
  ,@DeliveryFloor:=6\
  ,@DeliveryAppartment:=7\
  ,@DeliveryRemark:='לוליק'\
  ,@DeliveryStartTime:=NULL\
  ,@DeliveryEndTime:=NULL\
  ,@InsuranceValue:=NULL);"
           ,function(err,rows,field){console.log(rows[0][0].requestId)});
conn.end();