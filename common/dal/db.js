var mysql = require('mysql-native');
var User = require('../user/user.js');
var UserPermission = require('../user/userpermission.js');
var db = function () {
    var client = mysql.createTCPClient();
    client.auth('shipping', 'root', '');
    client.query('USE shipping');
    var queries = {
        GetUserData: "CALL shipping.GetUSerData ('{userName}','{password}');"
       , GetUserProfile: "CALL shipping.GetUserProfile({UserId});"
    };
    var CompileQuery = function (query, params) {
        var compiledQuery = query;
        Object.keys(params).forEach(function (p, idx) {
            compiledQuery = compiledQuery.replace('{' + p + '}', params[p]);
        });
        return compiledQuery;
    }
    var GetUserProfile = function (user, resultHandler, resultMessage) {
        var params = { UserId: user.id };
        var query = CompileQuery(queries.GetUserProfile, params);
        client.query(query)
            .on('row', function (row) {
                var permission = new UserPermission(row.PermissionId, false);
                user.AddPermission(permission);
            })
            .on('end', function (result) {
                if (resultHandler !== undefined) {
                    resultHandler(resultMessage, user);
                }

            });
    }
    ////////////////////////////////////////////////////////////
    this.Login = function (user, resultHandler) {
        var params = { userName: user.userName, password: user.password };
        var query = CompileQuery(queries.GetUserData, params);
        var resultMessage = { message: '', code: -1 };
        var user = null;
        client.query(query)
                .on('row', function (row) {
                    resultMessage.message = 'ok';
                    resultMessage.code = 0;
                    user = new User();
                    user.id = row.UserId;
                    user.userName = row.UserName;
                    user.password = row.Password;

                })
                .on('error', function (error) {
                    console.log(error);
                })
                .on('end', function (m) {
                    if (user === undefined) {
                        if (resultHandler !== undefined) {
                            resultHandler(resultMessage, user);
                        }
                    }
                    else {
                        GetUserProfile(user, resultHandler, resultMessage);
                    }
                    console.log('finished db login');
                });
    }
    ////////////////////////////////////////////////////////////////////

}
module.exports = db;