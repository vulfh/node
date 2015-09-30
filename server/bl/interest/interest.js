var Utils = require('util');

var ControllerHandler = require('../../../common/controllerhandler.js');
var CommandFactory = require('./commandfactory.js');
var Interest = function(db,logger){
    var _self = this;
    var dbService = db;
    var Logger = logger;
    
    function Begin(request,response) {
        var command = CommandFactory.createCommand(request,dbService,Logger,function(info){
                End(response,info);            
            });
        command.Execute();
    }
    function End(response,data){
        Logger.debug('Interest: response',data);
       
        response.send({success:data.success,description:data.description,data:data});
    }
    return function(req,res){
        Begin(req,res);
    }
}
Utils.inherits(Interest,ControllerHandler);
module.exports = Interest;