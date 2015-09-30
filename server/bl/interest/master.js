var Master = function(request,dal,logger,callback){
    var _self = this;
    var DbSvc = dal;
    var loggerSvc = logger;
    var onResult = callback;
    
    _self.Execute = function(){
        var userId = request.GetQueryParam('userId');
        var pageId = request.GetQueryParam('pageSize');
        var pageSize = request.GetQueryParam('pageId');
        DbSvc.GetInterests(userId,pageSize,pageId,function error(err){},
                                      function(info){
                                        if (onResult !== undefined && onResult !== null) {
                                            loggerSvc.debug(info);
                                            onResult(info);
                                        }
                                        })
    }
}
module.exports = Master;