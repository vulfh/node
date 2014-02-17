var User = require('./user,js');
var Authentication = function(db){
	this.dbService = db;


}
Authentication.prototype.Login = function(user){
	var authUser = this.dbService.Login(user);
	if(authUser !== null && authUser!== undefined){
		return {success:false,user:null};
	}
	else{
		return {success:true,user:user};
	}


}
module.exports = Authentication;