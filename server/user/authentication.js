var User = require('./user.js');
var Authorization = require('./authorization.js');
var crypto = require('crypto');
var Authentication = function (db, authorization) {
    var _self = this;
    var dbService = db;
    var authService = authorization;
    var response = null;
    var request = null;
    var resultMessage = { success: false, description: 'unknown', data: null };
    function Encrypt(data) {
        var shasum = crypto.createHash('sha1');
        shasum.update(data);
        return shasum.digest('hex');
    }
    function LoginBegin(req, res, auth) {
        response = res;
        request = req;
        debugger;
        if (request.Session.userContext !== undefined) {
            response.send(request.Session.userContext);
        } else {
            if (req.GetPostParam('userName') !== null && req.GetPostParam('password') !== null) {
                var user = new User();
                user.userName = req.GetPostParam('userName');
                user.password = req.GetPostParam('password');
                dbService.Login(user, LoginEnd);
            }
            else {
                resultMessage.success = false;
                resultMessage.description = 'userName or password is missing!';
                res.send(resultMessage);
            }
        }
    }

    function LoginEnd(error, authUser) {
        if (error === null) {
            if (authUser !== null) {
                resultMessage.success = true;
                resultMessage.data = { userName: authUser.userName, userId: Encrypt(authUser.id.toString()) };
                resultMessage.description = 'authenticated';

                authService(authUser, dbService, AuthorizationHandler);
            }
            else {
                resultMessage.success = false;
                resultMessage.data = user;
                resultMessage.description = 'authentication failed';
                response.send(resultMessage);
            }
        }
        else {
            resultMessage.success = false;
            resultMessage.description = error.message;
            response.send(resultMessage);
        }

    }

    function AuthorizationHandler(menuResult) {
        resultMessage.menu = menuResult;
        request.Session.userContext = resultMessage;
        response.send(resultMessage);
    }
    return function (req, res) { LoginBegin(req, res) };
}
module.exports = Authentication;