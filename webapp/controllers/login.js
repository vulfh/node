var crypto = require('crypto');
var Utils = require('util');
var ControllerHandler = require('../../common/controllerhandler.js');
var CommonMethods = require('../../common/commonmethods.js');

var Login = function (db, apiConnector,logger) {
    var dbService = db;
    var ApiConnectorService = apiConnector;
    var resultMessage = null;
    var authUser = null;
    var Logger = logger;
    function Encrypt(data) {
        var shasum = crypto.createHash('sha1');
        shasum.update(data);
        return shasum.digest('hex');
    }
    
    function AddUserToResultMessage(user) {
        var encUserId = Encrypt(user.id.toString());
        resultMessage.user = {};
        resultMessage.user.userId = encUserId;
        resultMessage.user.userName = user.userName,
        resultMessage.user.perspectives = user.perspectives;
        resultMessage.success = true;
        resultMessage.user.signedTOS = user.signedTOS;
        resultMessage.user.name = user.firstName+' ' +user.lastName;
        resultMessage.user.cityId = user.cityId;
        resultMessage.user.streetId = user.streetId;
        resultMessage.user.house = user.house;
        resultMessage.user.floor = user.floor;
        resultMessage.user.appartment = user.appartment;
        resultMessage.user.email = user.email;
        resultMessage.user.phone = user.phone;
        resultMessage.user.creditCard = user.defaultCreditCard;
        resultMessage.user.creditCardLast4 = user.defaultCreditCardLast4;
    }

    function BuildUserMenu(response,resultMessage) {
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
    function LoginBegin(request,response) {
        resultMessage = { success: false, description: 'unknown', data: null,token:request.Session.getToken() };
        request.Session.get('userContext',function(user){
            if (CommonMethods.isNull(user)=== false) {
                authUser = user;
                Logger.debug('User already logged in :', authUser);
                AddUserToResultMessage(authUser);
                dbService.GetMenu(function (error) {
                    Logger.error(error);
                    resultMessage.success = false;
                    resultMessage.description = 'Internal error';
                    response.send(resultMessage);
                }, BuildUserMenu(response, resultMessage));
            }
            else {
                var userName = request.GetPostParam('userName');
                var password = request.GetPostParam('password');
                Logger.debug('User starts login userName: %s, password %s', userName, password);
                ApiConnectorService.Authenticate({ userName: userName, password: password }
                                        , function onError(errDescription) {
                                            Logger.error(errDescription);
                                            resultMessage.description = "Internal error";
                                            response.send(resultMessage);
                                        }
                                        , function onResponse(data) {
                                            if (data.success === true) {
                                                authUser = data.data;
                                                Logger.info('User logged in successfuly:', authUser);

                                                request.Session.add('userContext', authUser);
                                                AddUserToResultMessage(authUser);
                                                dbService.GetMenu(function (error) {
                                                    Logger.error(error);
                                                    resultMessage.success = false;
                                                    resultMessage.description = 'Internal error';
                                                    response.send(resultMessage);
                                                }, BuildUserMenu(response, resultMessage));
                                            }
                                            else {
                                                Logger.error('User log in failed!');
                                                resultMessage.success = false;
                                                resultMessage.description = 'user login failed !';
                                                //resultMessage.code = data.code;
                                                if (data.code === -1) {
                                                    resultMessage.description = 'שם משתמש או ססמא אינם נכונים !';
                                                }
                                                Logger.debug("Sending login response:", resultMessage);
                                                response.send(resultMessage);
                                            }

                                        }
                );
            }
        
        });
        
    }
    ///////////////////////////////////////////////////////
    return function (req, res) {
        var request = req;
        var response = res;
        LoginBegin(request,response);
    }

}

Utils.inherits(Login, ControllerHandler);
module.exports = Login;