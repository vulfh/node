var CommonMethods = require('../../../common/commonmethods.js');
var Sign = function(request,dal,logger,config,callback){
    var _self = this;
    var _dbSvc = dal;
    var _loggerSvc = logger;
    var _onResult = callback;
    var _request = request;
    var _config = config;
    
    
    
    _self.Execute = function(){
        var userId = _request.GetPostParam('userId');
        _loggerSvc.debug('Received userId:',userId);
        
        if (isNaN(userId) === true || userId === 0){
            _loggerSvc.error('UserId is not a number :',userId);
            _onResult({result:false,method:_self.Method});
        }
        else{
            _dbSvc.TOS_UpdateSignature(userId,function(error){}
                                                  ,function(result){
                                                        if (result.success=== true) {
                                                            _onResult(result);
                                                        }
                                                        else{
                                                            _onResult({result:false,method:_self.Method});
                                                        }
                                                    });
        }
        
        
    }
}
module.exports = Sign;
