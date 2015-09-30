var Utils = require('util');
var ControllerHandler = require('../../common/controllerhandler.js');

var ProvidePrice = function(db,notifier,sessionManager,logger){
    var _self = this;
    var dbService = db;
    var Notifier = notifier;
    var Logger = logger;
     
    var SessionManager = sessionManager;
    function Begin(request,response){
        var price = request.GetPostParam('price');
        var userId = price.userId;
        request.Cache.ReadItem(userId,function(item,idx){
            
                var sessionId = price.sessionId;
                if (price !== undefined && price !== null) {
                   Logger.info("Got price %o ...",price);
                   SessionManager.CreatePrice(userId,sessionId,price.price,price.remark,function onPriceCreated(createdPrice){
                           Logger.debug("Created price ind DB ",createdPrice);
                           createdPrice.UserName = item.userName;
                           SessionManager.ProvidePrice(userId,createdPrice);
                           End(createdPrice,response);
                       });
               }
               else{
                   Logger.error('Got an empty price !!!');
               }
            
            
            });
       
        
    }
    function End(price,response){
        response.send({success:true,priceId:price.Id});
    }
    return function(req,res){
        var request = req;
        var response = res;
        Begin(request,response);
    }
}

Utils.inherits(ProvidePrice,ControllerHandler);
module.exports  = ProvidePrice;