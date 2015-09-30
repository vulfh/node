var Utils = require('util');

var ControllerHandler = require('../../../common/controllerhandler.js');
var CommandFactory = require('./commandfactory.js');
var TOS = function(db,logger,config){
    var _self = this;
    var dbService = db;
    var Logger = logger;
    var _config = config;
    
    function Begin(request,response) {
        var command = CommandFactory.createCommand(request,dbService,Logger,_config,function(info){
                End(response,info);            
            });
        command.Execute();
    }
    function End(response,data){
        Logger.debug('TOS: response',data);
       
        response.send({success:data.success,description:data.description,data:data});
    }
    return function(req,res){
        Begin(req,res);
    }
}
Utils.inherits(TOS,ControllerHandler);
module.exports = TOS;