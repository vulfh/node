var emailSvc = require('emailjs/email')
var proxy = function(config,logger){
    var _self = this;
    var _server = emailSvc.server.connect({
                                    user:config.get('EMAIL','auth').user,
                                    password:config.get('EMAIL','auth').pass,
                                    host:config.get('EMAIL','server')});
    var _logger = logger;
    function createMailOptions(mailDetails){
         var mailOptions= {
            to:mailDetails.to,
            from:mailDetails.from,
           // cc:mailDetails.cc,
            subject:mailDetails.subject,
            text:mailDetails.mailBody
        };
        return mailOptions;
    }
    _self.sendTextMail= function(mailDetails,errCallback,onResponse){
       var mailOptions = createMailOptions(mailDetails);
        _logger.debug('SendingEmail:',mailOptions);
        _server.send(mailOptions,function(error,response){
                        if (error) {
                            _logger.error('Failed to send email:',error);
                            if (typeof(errCallback)==='function') {
                                errCallback(error);
                            }
                            else{
                                _logger.debug('Mail sent successfuly :',response)
                                if(typeof(onResponse)==='function'){
                                    onResponse(response);
                                }
                            }
                        }
            });
    }
    _self.sendHtmlMail = function(mailDetails,errCallback,onResponse){
        var mailOptions = createMailOptions(mailDetails);
        mailOptions.attachment = [];
        mailOptions.attachment[0]={data:mailDetails.mailBody,alternative:true};
        _logger.debug('Sending HTML Email:',mailOptions);
        _server.send(mailOptions,function(error,response){
                                    if (error) {
                                        _logger.error('Failed to send email:',error);
                                        if (typeof(errCallback)==='function') {
                                            errCallback(error);
                                        }
                                        else{
                                            _logger.debug('Mail sent successfuly :',response)
                                            if(typeof(onResponse)==='function'){
                                                onResponse(response);
                                            }
                                        }
                                    }
            })
    }
    
}
module.exports = proxy;