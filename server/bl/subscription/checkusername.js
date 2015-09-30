var CheckUserName = function(request,dal,logger,callback){
    var _self = this;
    var DbSvc = dal;
    var loggerSvc = logger;
    var _onResult = callback;
    var _request = request;
    _self.Execute = function(){
        var userName = _request.GetPostParam('userName');
        DbSvc.Sub_IsUserNameUnique(userName,function onError(error){
                loggerSvc.error('occured error:',error);
            },
                                            function onResult(result){
                                                     if (typeof _onResult === 'function') {
                                                        loggerSvc.debug('UserName:', userName,' is unique:',result);
                                                        var data = {result:result};
                                                        _onResult(data);
                                                     }
                                                });
    }
}
module.exports = CheckUserName;