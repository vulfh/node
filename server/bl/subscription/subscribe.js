var Utils = require('util');

var ControllerHandler = require('../../../common/controllerhandler.js');
var CommandFactory = require('./commandfactory.js');
var Subscribe = function(db,logger,config,notifier){
    var _self = this;
    var dbService = db;
    var Logger = logger;
    var _config = config;
    var _notifier = notifier;
    
    function Begin(request,response) {
        var command = CommandFactory.createCommand(request,dbService,Logger,_config,_notifier,function(info){
                End(response,info);            
            });
        command.Execute();
    }
    function End(response,data){
        Logger.debug('Subscription: response',data);
       
        response.send({success:data.success,description:data.description,data:data});
    }
    return function(req,res){
        Begin(req,res);
    }
}
Utils.inherits(Subscribe,ControllerHandler);
module.exports = Subscribe;