var crypto = require('crypto');
var Utils = require('util');
var ControllerHandler = require('../../common/controllerhandler.js');


var Login = function (db, apiConnector) {
    var dbService = db;
    var ApiConnectorService = apiConnector;
    var resultMessage = null;
    var authUser = null;
    function Encrypt(data) {
        var shasum = crypto.createHash('sha1');
        shasum.update(data);
        return shasum.digest('hex');
    }
    function BuildUserMenu() {
        return function (menu) {
            var userMenu = {};
            Object.keys(menu).forEach(function (m, idx) {
                var item = menu[m];
                if (item.CheckPermissionMask(authUser.permissionMask) === true) {
                    userMenu[m.toString()] = item;
                }
            });


            resultMessage.menu = { menu: userMenu };
            response.send(resultMessage);
        }
    }
    function LoginBegin() {
        var userName = request.GetPostParam('userName');
        var password = request.GetPostParam('password');
        if (request.Session.userContext !== undefined) {
            resultMessage.success = true;
            resultMessage.userName = request.Session.userContext.userName;
            response.send(resultMessage);
        }
        else {
            ApiConnectorService.Authenticate({ userName: userName, password: password }
                                    , function onError(errDescription) {
                                        console.log(errDescription);
                                        resultMessage.description = "Internal error";
                                        response.send(resultMessage);

                                    }
                                    , function onResponse(data) {
                                        if (data.success === true) {
                                            authUser = data.data;
                                            request.Session.userContext = data.data;
                                            var encUserId = Encrypt(data.data.id.toString());
                                            resultMessage.user = {};
                                            resultMessage.user.userId = encUserId;
                                            resultMessage.user.userName = data.data.userName,
                                                resultMessage.success = true;
                                            dbService.GetMenu(function (error) {
                                                console.log(error);
                                                resultMessage.success = false;
                                                resultMessage.description = 'Internal error';
                                                response.send(resultMessage);
                                            }, BuildUserMenu());
                                        }
                                        else {
                                            resultMessage.success = false;
                                            resultMessage.description = data.description;
                                            response.send(resultMessage);
                                        }

                                    }
            );
        }
    }
    ///////////////////////////////////////////////////////
    return function (req, res) {
        resultMessage = { success: false, description: 'unknown', data: null };
        request = req;
        response = res;
        LoginBegin();
    }

}

Utils.inherits(Login, ControllerHandler);
module.exports = Login;