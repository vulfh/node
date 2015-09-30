var Utils = require('util');
var ControllerHandler = require('../../common/controllerhandler.js');

var Deal = function(db,apiConnector,logger){
    var _self = this;
    var Logger = logger;
     var ApiConnector = apiConnector;
     function Begin(request,response) {
         request.Session.get('userContext', function (user) {
             var price = request.GetPostParam('price');
             Logger.info("Deal arrived from user ", user.id, " for price ", price);
             ApiConnector.SubmitDeal(user.id, price.SessionId, price.Id, function onError(error) { },
                                          function onResponse(data) {
                                              End(data, response);
                                          });
         });
      
     }
     function End(dealDetails,response){
        
        response.send({success:true});
        Logger.info("Deal ",dealDetails," was sent client...");
     }
     return function(req,res){
        var request = req;
        var response = res;
        Begin(request,response);
     }
}
Utils.inherits(Deal,ControllerHandler);
module.exports = Deal