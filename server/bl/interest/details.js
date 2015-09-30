var Details = function(request,dal,logger,callback){
    var _self = this;
    var DbSvc = dal;
    var loggerSvc = logger;
    var onResult = callback;
    
    _self.Execute = function(){
        var interestId = request.GetQueryParam('interestId');
        loggerSvc.debug('interestId:',interestId);
        DbSvc.GetInterestDetails(interestId,function error(err){
                                        loggerSvc.error('Failed to retrieve master details for interest ',interestId,' error:',err);
            },
                                      function(info){
                                        if (onResult !== undefined && onResult !== null) {
                                            loggerSvc.debug(info);
                                            onResult(info);
                                        }
                                        })
    }
}
module.exports = Details;