var LoggerFacade = require('../../../common/logger/facade.js');
var CheckUserName = require('./checkusername.js');
var CheckEmail = require('./checkemail.js');
var SaveUser = require('./saveuser.js');
var ApproveUser = require('./approve.js');
var EmailFacade = require('../email/facade.js');

var CommandFactory = {};
CommandFactory.createCommand = function(request,dal,logger,config,notifier,callback){
     var method = request.GetPostParam('method');
    var command = {};
    
    switch(method){
        case 'CHECK-USER-NAME':
            var logFacade = new LoggerFacade(logger,'SUBSCRIPTION-CHECK-USER-NAME');
            command = new CheckUserName(request,dal,logFacade,callback);
            break;
        case 'CHECK-EMAIL':
            var logFacade = new LoggerFacade(logger,'SUBSCRIPTION-CHECK-EMAIL');
            command = new CheckEmail(request,dal,logFacade,callback);
            break;
        case 'SAVE-USER':
            var logFacade = new LoggerFacade(logger,'SUBSCRIPTION-SAVE-USER');
            var emailFacade = new EmailFacade(config,logFacade);
            command = new SaveUser(request,dal,logFacade,emailFacade,config,callback);
            break;
        case 'APPROVE-USER':
              var logFacade = new LoggerFacade(logger,'SUBSCRIPTION-APPROVE-USER');
              var emailFacade = new EmailFacade(config,logFacade);
              command = new  ApproveUser(request,dal,logFacade,emailFacade,config,notifier,callback);
          break;
    }
    command.Method = method;
    return command;
}
module.exports = CommandFactory;