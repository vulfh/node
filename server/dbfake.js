var User = require('./user.js');
var FakeDb = function(){
	
}
FakeDb.prototype.Login = function (user) {
    if (user.userName === 'vulf' && user.password === '1234') {
        return user;
    }
    else {
        return null;
    }
}
module.exports = FakeDb;
