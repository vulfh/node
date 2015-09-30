var UserPermission = require('../../../common/user/userpermission.js');
var CommonMethods = require('../../../common/commonmethods.js');

var SaveUser = function(request,dal,logger,emailSvc,config,callback){
    var _self = this;
    var DbSvc = dal;
    var loggerSvc = logger;
    var _onResult = callback;
    var _emailSvc = emailSvc;
    var _request = request;
    var _configSvc = config;
    _self.Method = '';
    function BuildQuery(){
        var query = {};
        query.UserName = _request.GetPostParam('userName');
        query.Password = _request.GetPostParam('password');
        query.Email = _request.GetPostParam('email');
        query.FirstName = _request.GetPostParam('firstName');
        query.LastName = _request.GetPostParam('lastName');
        query.Phone1 = _request.GetPostParam('phone1');
        query.Phone2 = _request.GetPostParam('phone2');
        var isSender = _request.GetPostParam('isSender');
        var isProvider = _request.GetPostParam('isProvider');
        var role = 1; // Guest
        if (isSender===true) {
           role = 5;
        }
        if (isProvider=== true) {
            role = 2;
        }
        query.RoleId = role;
        return query;
    }
    function Save (user){
        DbSvc.Sub_SaveUser(user,function onError(error){
                loggerSvc.error('occured error:',error);
            },
            function onResult(result){
                if (typeof _onResult === 'function') {
                                                        var encryptionPassword = _configSvc.get('ENCRYPTION','password');
                                                        var encryptedUserId = CommonMethods.encryptAes256Ctr(result,encryptionPassword);
                                                        loggerSvc.debug('User:', user,' saved successfuly ...');
                                                        var data = {result:true,description:'נשמר בהצלחה!',method:_self.Method};
                                                        _emailSvc.sendConfirmationEmail({
                                                            to:user.Email
                                                           ,userId:encryptedUserId
                                                            },function(){
                                                                loggerSvc.error('Error sending mail !');
                                                                },
                                                              function(){
                                                                loggerSvc.debug('Email sent successfuly ...');
                                                              })
                                                        _onResult(data);
                                                     }
            });
    }
    _self.Execute = function(){
        var query = BuildQuery();
        DbSvc.Sub_IsEmailUnique(query, function onError(error) {
                loggerSvc.error('occured error:',error);
            },
                                            function onResult(result){
                                                     if (result=== true) {
                                                        loggerSvc.debug('User:',query,'Passed validation')
                                                        Save(query);
                                                     }
                                                     else{
                                                        loggerSvc.warn('User:',query,' is not unique !')
                                                        var data = {result:false,description:'שם משתמש או כתובת דואר אלקטרונית לא יחודיים!'}
                                                        _onResult(data);
                                                     }
                                                });
    }
}
module.exports = SaveUser;