var Utils = require('util');
var User = require('../../common/user/user.js');
var ControllerHandler = require('../../common/controllerhandler.js');
var UserPermission = require('../../common/user/userpermission.js');
var UserPerspective = require('../../common/user/perspective.js');
var UserProcessor = require('./userprocessor.js');
var Authentication = function (db, notifier,logger) {
    var _self = this;
    var dbService = db;
    var Logger = logger;
    _self.Notifier = notifier;
    resultMessage = {};

    
   
    function LoginBegin(req, res, auth) {
        response = res;
        request = req;
        var resultMessage ={success:false,code:0,description:''};
        if (req.GetPostParam('userName') !== null && req.GetPostParam('password') !== null) {
            var user = new User();
            user.userName = req.GetPostParam('userName');
            user.password = req.GetPostParam('password');
            Logger.info("Login request arrived for " ,user);
            dbService.Login(user, function (error, authUser) {
                if(error.code === 0){
                    UserProcessor.processUser(authUser, _self.Notifier, request.Cache,
                        function (user) {
                            LoginEnd(error, user, resultMessage, req, res);
                        });
                }
                else {
                    LoginEnd(error, authUser, resultMessage, req, res);
                }
            });
        }
        else {
            Logger.warn('Either user name or password was not provided !');
            resultMessage.success = false;
            resultMessage.description = 'userName or password is missing!';
            res.send(resultMessage);
        }
    }

    function LoginEnd(error, authUser,resultMessage,request,response) {
        
        if (error.code === 0) {
            if (authUser !== null) {
                Logger.debug('User logged in successfuly :',authUser);
                resultMessage.success = true;
                resultMessage.data = authUser;
                resultMessage.description = 'authenticated';
                resultMessage.code=0;
                response.send(resultMessage);
            }
            else {
                Logger.error('User login failed :',user);
                resultMessage.success = false;
                resultMessage.data = user;
                resultMessage.code=-1;
                resultMessage.description = 'authentication failed. reason:' + error;
                response.send(resultMessage);
            }
        }
        else {
            resultMessage.success = false;
            resultMessage.code= error.code;
            resultMessage.description = error.message;
            response.send(resultMessage);
        }

    }
    return function (req, res) { LoginBegin(req, res) };
}
Utils.inherits(Authentication,ControllerHandler);
module.exports = Authentication;