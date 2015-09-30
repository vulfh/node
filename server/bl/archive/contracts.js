var Contracts = function(request,dal,logger,contractorType,callback){
    var _self = this;
    var userId = request.GetPostParam('userId');
    var startDate = request.GetPostParam('startDate');
    var endDate = request.GetPostParam('endDate');
    var pageId = request.GetPostParam('pageId');
    var pageSize = request.GetPostParam('pageSize');
    var deliveryStatusOriginId = parseInt(request.GetPostParam('deliveryStatusOriginId'));
    var dbSvc = dal;
    var loggerSvc = logger;
    var onResult = callback;
    function validate() {
        if (startDate === undefined || startDate === null) {
            startDate = 'NULL';
        }
        else{
            startDate ="'"+startDate+"'";
        }
        if (endDate === undefined || endDate === null) {
            endDate = 'NULL';
        }
        else{
            endDate ="'"+endDate+"'";
        }
        if (pageId === undefined || pageId === null) {
            pageId = 'NULL';
        }
        if (pageSize === undefined || pageSize === null) {
            pageSize = 'NULL';
        }
    }
    _self.Execute = function(){
            validate();
           var params = {UserId:userId
                        ,StartTime:startDate
                        ,EndTime:endDate
                        ,PageSize:pageSize
                        ,PageId:pageId
                        ,ContractTypeId:contractorType
                        ,DeliveryStatusOriginId:deliveryStatusOriginId};
            loggerSvc.debug('got params :',params);
            dbSvc.GetArchivedDeals(params,function(arcPackage){
                    if (onResult !== undefined && onResult !== null) {
                        onResult(arcPackage);
                    }
                });
    }
}
Contracts.SENDER =1;
Contracts.PROVIDER =2;
module.exports = Contracts;