var Save = function(request,dal,logger,callback){
    var _self = this;
    var DbSvc = dal;
    var loggerSvc = logger;
    var onResult = callback;
    
    _self.Execute = function(){
        var interest = request.GetPostParam('data');
        DbSvc.UpsertInterest(interest,function error(err){},
                                      function(info){
                                        if (onResult !== undefined && onResult !== null) {
                                            loggerSvc.debug(info);
                                            onResult(info);
                                        }
                                        })
    }
}
module.exports = Save;