var EmailProxy = require('./proxy.js');
var fs = require('fs');
var MailCompiler = require('../../../common/template.js');
var Facade = function(config,logger){
    var _proxy = new EmailProxy(config,logger);
    var _self = this;
    var _logger = logger;
     var builder = new MailCompiler.CompilerBuilder().createBuilder();
    var _config = config;
    var _mailCompiler = builder.create(logger)
                               .disableSqlInjection()
                               .get();
    _self.sendConfirmationEmail = function(details){
        fs.readFile('./bl/email/templates/confirmation.html','utf8',function(err,data){
                    if (err) {
                        _logger.error('Failed to load email template: ',err);
                    }
                    else{
                         var confMail = data;
                         var approveMail = _config.get('URL','mail_approve');
                        confMail = _mailCompiler.CompileQuery(confMail,{url:approveMail+details.userId});
                        var mailDetails = {
                            to:details.to,
                            };
                            mailDetails.subject = 'נא לאמת את כתובת המייל.';
                            mailDetails.mailBody = confMail;
                            mailDetails.from = 'shipping site <vulfh@expryse.com>';
                            _proxy.sendHtmlMail(mailDetails,function(){},function(){});
                            
                        }
            });
    }
}
module.exports = Facade;