var Packages = function(request,dal,logger,contractorType,callback){
    var _self = this;
    var dealId = request.GetPostParam('dealId');
    var loggerSvc = logger;
    var onResult = callback;
    var dbSvc = dal;


    _self.Execute = function(){
        loggerSvc.debug('DealId:',dealId);
        dbSvc.GetArchiveDealPackages(dealId,function(arcPackage){
                            if (onResult !== undefined && onResult !== null) {
                                onResult(arcPackage);
                            }
            });
    }
}
module.exports = Packages;
