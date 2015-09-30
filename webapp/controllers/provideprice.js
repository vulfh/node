var Utils = require('util');
var ControllerHandler = require('../../common/controllerhandler.js');
var LoggerFacade = require('../../common/logger/facade.js');

var ProvidePrice = function(db,apiConnector,logger){
    var ApiConnector = apiConnector;
    var Logger = new LoggerFacade(logger,'PROVIDE-PRICE');
    
    function Begin(request,response){
        request.Session.get('userContext', function (user) {
            var price = request.GetPostParam('price');
            var remark = request.GetPostParam('remark');
            var sessionId = request.GetPostParam('sessionId');
            Logger.debug('user:', user, ' price:', price, ' sessionId:', sessionId);
            ApiConnector.SendPrice(sessionId, user.id, price, remark, function onError(error) { },
                                         function onResponse(data) {
                                             End(data, response);
                                         });
        });
      
    }
    function End(data,response){
        response.send({success:true});
    }
    return function(req,res){
        var request = req;
        var response = res;
        Begin(request,response);
    }
}
Utils.inherits(ProvidePrice,ControllerHandler);
module.exports = ProvidePrice;