var Utils = require('util');
var User = require('../../common/user/user.js');
var Authorization = require('./authorization.js');
var ControllerHandler = require('../../common/controllerhandler.js');

var Authentication = function (db, authorization) {
    var _self = this;
    var dbService = db;
    var authService = authorization;
    resultMessage = {};


    function LoginBegin(req, res, auth) {
        response = res;
        request = req;
        console.log('request arrived ...');
        if (req.GetPostParam('userName') !== null && req.GetPostParam('password') !== null) {
            var user = new User();
            user.userName = req.GetPostParam('userName');
            user.password = req.GetPostParam('password');
            dbService.Login(user, LoginEnd);
        }
        else {
            console.log('user not found !');
            resultMessage.success = false;
            resultMessage.description = 'userName or password is missing!';
            res.send(resultMessage);
        }
    }

    function LoginEnd(error, authUser) {
        debugger;
        if (error === null) {
            if (authUser !== null) {
                resultMessage.success = true;

                request.Cache.AddItem(authUser.id, authUser);
                resultMessage.data = authUser;
                resultMessage.description = 'authenticated';
                response.send(resultMessage);
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
Utils.inherits(Authentication,ControllerHandler);
module.exports = Authentication;