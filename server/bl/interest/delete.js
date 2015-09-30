var Delete = function(request,dal,logger,callback){
    var _self = this;
    var DbSvc = dal;
    var loggerSvc = logger;
    var onResult = callback;
    
    _self.Execute = function(){
        var interest = request.GetPostParam('data');
        DbSvc.DeleteInterest(interest.InterestId,function error(err){},
                                      function(){
                                        if (onResult !== undefined && onResult !== null) {
                                            loggerSvc.debug();
                                            onResult({});
                                        }
                                        })
    }
}
module.exports = Delete;