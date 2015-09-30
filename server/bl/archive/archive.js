var Utils = require('util');

var ControllerHandler = require('../../../common/controllerhandler.js');
var UserPermission = require('../../../common/user/userpermission.js');
var CommandFactory = require('./commandfactory.js');

var Archive = function(db,logger){
    var _self = this;
    var dbService = db;
    var Logger = logger;
    
    function Begin(request,response){
        var command = CommandFactory.createCommand(request,dbService,Logger,function(arcPackage){
                  End(response,arcPackage);
            });
        command.Execute();
        
    }
    
    function End(response,data){
        Logger.debug('Archive: response',data);
       
        response.send({success:data.success,description:data.description,data:data});
    }
    
    return function(req,res){
        Begin(req,res);
    }
}

Utils.inherits(Archive,ControllerHandler);
module.exports = Archive;