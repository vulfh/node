var Save = require('./save.js');
var Master = require('./master.js');
var Details = require('./details.js');
var Delete = require('./delete.js');
var LoggerFacade = require('../../../common/logger/facade.js');
var CommandFactory = {};
CommandFactory.createCommand = function(request,dal,logger,callback){
    var method = request.GetPostParam('method');
    
    var command = {};
    switch (method) {
        case 'SAVE':
            var logFacade = new LoggerFacade(logger,'INTEREST-SAVE');
            command = new Save(request,dal,logFacade,callback);
            break;
        case 'MASTER':
            var logFacade = new LoggerFacade(logger,'INTEREST-MASTER');
            command = new Master(request,dal,logFacade,callback);
            break;
        case 'DETAILS':
            var logFacade = new LoggerFacade(logger,'INTEREST-DETAILS');
            command = new Details(request,dal,logFacade,callback);
            break;
        case 'DELETE':
            var logFacade = new LoggerFacade(logger,'INTEREST-DELETE');
            command = new Delete(request,dal,logFacade,callback);
            break;
    }
    return command;
}
module.exports = CommandFactory;
