var Utils = require('util');
var ControllerHandler = require('../../common/controllerhandler.js');
var LoggerFacade = require('../../common/logger/facade.js');

var GetUpdates = function (db, notifier,logger) {
    var _self = this;
    var dbService = db;
    var Notifier = notifier;
    var Logger = new LoggerFacade(logger,'GET-UPDATES');
    
    var userId = undefined;
    var counter = 0;
    function Begin(request,response) {
        var action = request.GetPostParam('action');
        
        var resultMessage = { success: false, description: 'unknown', data: '' };
        userId = request.GetPostParam('userId');
        var msg_counter = request.GetPostParam('msg_cnt');
        switch(action){
            case 'ack':
                   // Logger.debug('ACK for msg: '+msg_counter+' of user ' + userId+' ...');
                    Notifier.RemoveMessagesByPacketId(userId,msg_counter);
                    resultMessage.success= true;
                    resultMessage.description = 'ACK-'+msg_counter;
                    End(action,resultMessage,msg_counter,response);
                    break;
            default:
                   // Logger.debug('msg: '+msg_counter+' updates for user ' + userId+' ...');
                    Notifier.GetMessagesForUser(userId, msg_counter,function(messages){
                                                Logger.debug('Message [',messages,'] will be sent to user ',userId);
                                                End(action,messages,msg_counter,response)});
        }
    }

    function End(action,messages,msg_counter,response) {
        //Logger.debug('ACTION:',action,'sending messages',messages,' to user '+userId+' original message #'+msg_counter);
        response.send(messages);
    }

    return function (req, res) {
        var request = req;
        var response = res;
        Begin(request,response);
    }

}
Utils.inherits(GetUpdates, ControllerHandler);
module.exports = GetUpdates;