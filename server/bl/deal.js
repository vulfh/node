var Utils = require('util');
var ControllerHandler = require('../../common/controllerhandler.js');

var Deal = function(db,notifier,sessionManager,logger){
    var _self = this;
    var dbService = db;
    var Notifier = notifier;
    var SessionManager = sessionManager;
    var Logger = logger;
    
    function SetupUserData(user,users) {
        for(var ui =0;ui<users.length;ui++){
            if (user === users[ui].id) {
                return {userId:users[ui].id,userName:users[ui].userName};
            }
        }
        return undefined;
    }
    function Begin(request,response){
        var deal = request.GetPostParam('deal');
        Logger.debug("Deal arrived ",deal);
        SessionManager.CreateDeal(deal.sessionId,deal.priceId,function (dealDetails){
            Logger.info("DealDetails:",dealDetails);
            request.Cache.ReadArray([dealDetails.SenderUser,dealDetails.ProviderUser],function(users){
                    dealDetails.SenderUser = SetupUserData(dealDetails.SenderUser,users);
                    dealDetails.ProviderUser = SetupUserData(dealDetails.ProviderUser,users);
                    SessionManager.Deal(dealDetails);
                });
            });
        Logger.debug("Got DEAL :",deal);
        End(deal,response);
    }
    function End(deal,response){
        response.send({success:true});
        Logger.info("Deal ",deal," was sent ...");
    }
    
    return function(req,res){
        var request = req;
        var response = res;
        Begin(request,response); 
    }
}
Utils.inherits(Deal,ControllerHandler);
module.exports = Deal;
