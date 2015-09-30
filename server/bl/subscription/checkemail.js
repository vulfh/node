var CheckEmail = function(request,dal,logger,callback){
    var _self = this;
    var DbSvc = dal;
    var loggerSvc = logger;
    var _onResult = callback;
    var _request = request;
    _self.Execute = function(){
        var email = _request.GetPostParam('email');
        DbSvc.Sub_IsEmailUnique(email,function onError(error){
                loggerSvc.error('occured error:',error);
            },
                                            function onResult(result){
                                                     if (typeof _onResult === 'function') {
                                                        loggerSvc.debug('Email:', email,' is unique:',result);
                                                        var data = {result:result};
                                                        _onResult(data);
                                                     }
                                                });
    }
}
module.exports = CheckEmail;