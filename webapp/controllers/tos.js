var Utils = require('util');
var CommonMethods = require('../../common/commonmethods.js');
var LoggerFacade = require('../../common/logger/facade.js');
var ControllerHandler = require('../../common/controllerhandler.js');
var TOS = function(db,apiConnector,config,logger){
    var _self = this;
    var Logger = new LoggerFacade(logger,'SUBSCRIBE');
    var ApiConnector = apiConnector;
    var DbSvc = db;
    var ConfigSvc = config;
    function BuildQuery(request){
        var query = {};
        query.Method = request.GetPostParam('Method');
        if (CommonMethods.isNull(query.Method)===true) {
            query.Method = request.GetQueryParam('Method');
        }
        return query;
    }
    
    
    function Begin(req,res){
            var request = req;
            var query = BuildQuery(request);
            Logger.debug('Arrived request', query);
            req.Session.get('userContext', function (user) {
                Logger.debug(user);
                query.UserId = user.id;
                ApiConnector.ProcessTOSRequest(query, function onError(errDescription) { }
                                          , function (data) {
                                              Logger.debug('TOS response ', data);
                                              user.signedTOS = data.success;
                                              request.Session.add('userContext',user);
                                              End(res, { success: data.success });
                                          });
            });
           
    }
    function End(response,data) {
         response.send(data);
    }
    
    
     return function(req,res){
        return Begin(req,res);
    }
}
Utils.inherits(TOS,ControllerHandler);
module.exports = TOS;