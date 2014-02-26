var User = require('./user/user.js');
var Authentication = function (db) {
    var _self = this;
    var dbService = db;


    function Login(req, res) {
        var resultMessage = { success: false, description: 'unknown', data: null };
        if (req.GetPostParam('userName') !== null && req.GetPostParam('password') !== null) {
            var user = new User();
            user.userName = req.GetPostParam('userName');
            user.password = req.GetPostParam('password');
            var authUser = dbService.Login(user);
            if (authUser !== null) {
                resultMessage.success = true;
                resultMessage.data = authUser;
                resultMessage.description = 'authenticated';
                resultMessage.menu = dbService.GetMenu(authUser);
            }
            else {
                resultMessage.success = false;
                resultMessage.data = user;
                resultMessage.description = 'authentication failed';
            }
        }
        else {
            resultMessage.success = false;
            resultMessage.description = 'userName or password is missing!';
        }
        res.send(resultMessage);

    }
    return function (req, res) { Login(req, res) };
}
module.exports = Authentication;