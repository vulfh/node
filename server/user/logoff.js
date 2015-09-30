var Utils = require('util');
var User = require('../../common/user/user.js');
var ControllerHandler = require('../../common/controllerhandler.js');
var CommonMethods = require('../../common/commonmethods.js');

var Logoff = function(db,notifier,sessionManager,logger) {
    var _self = this;
    var dbService = db;
    var Notifier = notifier;
    var Logger = logger;
    var SessionManager = sessionManager;
    
    function Begin(request,response){
        var userId = request.GetPostParam('userId');
        request.Cache.TakeItem(userId,function(user,idx){
            Logger.info('removing user:', user, ' from CACHE...');
            if (CommonMethods.isNull(user) === false) {
                SessionManager.RemoveSessionAndPricesOfUser(user.id);
                Notifier.RemoveUser(user.id);
                End(userId, response);
            }
            else {
                End(-1, response);
            }
            });
    }
    function End(userId,response){
        Logger.debug('User logged off ',userId);
        var resp = {userId:userId};
        response.send(resp);
    }
    
    return function(req,res){
        var request = req;
        var response= res;
        Begin(request,response);
    }
}
Utils.inherits(Logoff,ControllerHandler);
module.exports = Logoff;