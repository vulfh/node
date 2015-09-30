var LoggerFacade = require('../../../common/logger/facade.js');
var Sign = require('./sign.js');

var CommandFactory = {};
CommandFactory.createCommand = function(request,dal,logger,config,callback){
     var method = request.GetPostParam('method');
    var command = {};
    
    switch(method){
        case 'SIGN':
            var logFacade = new LoggerFacade(logger,'TOS');
            command = new Sign(request,dal,logFacade,config,callback);
            break;
    }
    command.Method = method;
    return command;
}
module.exports = CommandFactory;