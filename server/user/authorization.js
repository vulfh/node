var User = require('./user.js');
var UserPermission = require('./userpermission.js');

var Authorization = function () {
        var userAuthorizedHandler = null;
        var authUser = null;
        var GetCustomMenuBegin = function (user, dbService, handler) {
            userAuthorizedHandler = handler;
            authUser = user;
            dbService.GetMenu(function errorHandler(err) { }, GetCustomMenuEnd);

        }
        var GetCustomMenuEnd = function (fullMenu) {
            var menu = {};
            for (key in fullMenu) {
                var i = fullMenu[key];
                if (i.CheckPermissionMask(authUser.GetPermissionMask()) === true) {
                    menu[key.toString()] = i;
                }
            }
            if (userAuthorizedHandler !== null) {
                userAuthorizedHandler({ defaultPageId: "3", menu: menu });
            }
        }
    return function (user, dbService, handler) { GetCustomMenuBegin(user, dbService, handler); }
}

module.exports = Authorization;