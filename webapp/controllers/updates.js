var Utils = require('util');
var ControllerHandler = require('../../common/controllerhandler.js');

var Updates = function (db, apiConnector,logger) {
    var _self = this;
    var dbService = db;
    var Logger = logger;
    var ApiConnectorService = apiConnector;
    var counter =0 ;
    var _moduleName = '[UPDATES]';
    function Begin(request,response) {
         
        
        request.Session.get('userContext', function (user) {
            var messageCounter = user.id + '-' + request.GetQueryParam('mc');
            var action = request.GetQueryParam('action');
            Logger.debug(_moduleName, 'BEGIN MESSAGE [', action, ']#' + messageCounter + ' send request  to SERVER');

            apiConnector.GetUpdates(user.id, messageCounter, action,
                                                                function onError(desc) {
                                                                    Logger.error(_moduleName, 'Occured error while sending message ', messageCounter, 'details:', action, desc);
                                                                },
                                                                function onResposne(messages) {
                                                                    Logger.debug(_moduleName, 'Message:', messages);
                                                                    End(action, messages, messageCounter, request, response);
                                                                });
        });
        
    }
    function End(action,messages,cnt,request,response) {
        Logger.debug(_moduleName,'sending [',action,']',cnt," :",messages,' ....');
        
        try{
            response.send(messages);
            Logger.debug('END MESSAGE [',action,']#'+cnt+' sent to CLIENT');
        }
        catch(e)
        {
            Logger.error(_moduleName,e.toString());
        }
        
    }
    return function (req, res) {
        var request = req;
        var response = res;
        Begin(request,response);
    }
}
Utils.inherits(Updates, ControllerHandler);
module.exports = Updates;