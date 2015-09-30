var UpdateStatus = function(request,dal,logger,callback){
    var _self = this;
    var dealId = request.GetPostParam('dealId');
    var userId = request.GetPostParam('userId');
    var deliveryStatusId = request.GetPostParam('deliveryStatusId')
    var loggerSvc = logger;
    var onResult = callback;
    var dbSvc = dal;


    _self.Execute = function(){
        loggerSvc.debug('DealId:',dealId,'UserId:',userId,'DeliveryStatusId:',deliveryStatusId);
        dbSvc.Delivery_UpdateStatus({DealId:dealId,StatusId:deliveryStatusId,UserId:userId},function(err){
                loggerSvc.error('Update status failed for ',dealId,'. Error:',err);
            },
            function(arcPackage){
                            if (onResult !== undefined && onResult !== null) {
                                onResult(arcPackage);
                            }
            });
    }
}
module.exports = UpdateStatus;
