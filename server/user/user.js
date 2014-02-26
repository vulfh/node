var UserPermission = require('./userpermission.js');
var User = function () {
    this.userName = null;
    this.password = null;
    this.id = null;
    this.permissions = [];
    this.permissionMask = 0;

}
//////////////////////////////////////////////////////////////////
User.prototype.HasPermission = function (permission) {
    for (p in this.permissions) {
        if (p.CurrentPermission === permission) {
            return true;
        }
    }
    return false;
}
/////////////////////////////////////////////////////////////////
User.prototype.AddPermission = function (permission) {
    this.permissions.push(permission);
    this.permissionMask = (this.permissionMask | permission.CurrentPermission);
}
/////////////////////////////////////////////////////////////////
User.prototype.GetPermissionMask = function () {
    return this.permissionMask;
}
module.exports = User;