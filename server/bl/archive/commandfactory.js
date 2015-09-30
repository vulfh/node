var Contracts = require('./contracts.js')
var Packages = require('./packages.js');
var LoggerFacade = require('../../../common/logger/facade.js');
var UserPerspective = require('../../../common/user/perspective.js');
var UpdateStatus = require('./updatestatus.js');
var CommandFactory = {}
CommandFactory.createCommand = function(request,dal,logger,callback){
    var method = request.GetPostParam('method');
    var command={};
    switch(method){
        case UserPerspective.SENDER:
                var logFacade = new LoggerFacade(logger,'ARCHIVE-SENDER');
                command = new Contracts(request,dal,logFacade,Contracts.SENDER,callback);
            break;
        case UserPerspective.PROVIDER:
                var logFacade = new LoggerFacade(logger,'ARCHIVE-PROVIDER');
                command = new Contracts(request,dal,logFacade,Contracts.PROVIDER,callback);
            break;
        case UserPerspective.DEAL_PACKAGES:
                var logFacade = new LoggerFacade(logger,'ARCHIVE-DEAL-PACKAGES');
                command = new Packages(request,dal,logFacade,null,callback);
            break;
        case 'update':
            var logFacade = new LoggerFacade(logger,'ARCHIVE-UPDATE-DELIVERY-STATUS');
            command = new UpdateStatus(request,dal,logFacade,callback);
            break;
    }
    return command;
}

module.exports = CommandFactory;