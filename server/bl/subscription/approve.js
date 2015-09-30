var CommonMethods = require('../../../common/commonmethods.js');
var UserProcessor = require('../../user/userprocessor.js');
var Approve = function(request,dal,logger,emailSvc,config,notifier,callback){
    var _self = this;
    var _dbSvc = dal;
    var _loggerSvc = logger;
    var _onResult = callback;
    var _emailSvc = emailSvc;
    var _request = request;
    var _notifier = notifier;
    var _config = config;
    
    function Approve(encryptedUserId){
        
    }
    
    _self.Execute = function(){
        var encryptedUserId = _request.GetPostParam('userId');
        _loggerSvc.debug('Received encrypted userId:',encryptedUserId)
        var encryptionPassword = config.get('ENCRYPTION','password');
        var userId = parseInt(CommonMethods.decryptAes256Ctr(encryptedUserId,encryptionPassword));
        if (isNaN(userId) === true || userId === 0){
            _loggerSvc.error('UserId is not a number :',userId);
            callback({result:false,method:_self.Method});
        }
        else{
            _loggerSvc.debug('Decrypted userId:',userId);
            _dbSvc.Sub_ApproveUser({UserId:userId},function(error){}
                                                  ,function(result){
                                                      if (result === 1) {
                                                          loginApprovedUser(userId);
                                                        }
                                                        else{
                                                            callback({result:false,method:_self.Method});
                                                        }
                                                    });
        }
        
        
    }
    function loginApprovedUser(userId)
    {
        _dbSvc.Login({ userId: userId },function (error, userData) {
            if (error.code == 0) {
                UserProcessor.processUser(userData, _notifier, _request.Cache, function (user) {
                    callback({ result: true, data: userData, method: _self.Method });
                });
            }
            else {
                _loggerSvc.error('Failed to get userdata by UserId. Reason:', error);
                callback({ result: false, method: _self.Method });
            }
        });
    }
}
module.exports = Approve;
