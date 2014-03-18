var HttpProxy = require('../common/httpproxy.js');
var ApiConnector = function () {
    this.HOST = 'localhost';
    this.PORT = 3002;

     this.Authenticate = function(userData, errCallback, callback) {
        HttpProxy.Post(this.HOST,this.PORT, '/authenticate',
                                    { userName: userData.userName, password: userData.password }
                                    , function onError(errDescription) {
                                        if (errCallback !== undefined)
                                            errCallback(errDescription);
                                    }
                                    , function onResponse(data) {
                                        if (callback !== undefined)
                                            callback(data);

                                    }
            );
    }
}
module.exports = ApiConnector;  