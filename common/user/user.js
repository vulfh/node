var UserPermission = require('./userpermission.js');
var User = function () {
    this.userName = null;
    this.password = null;
    this.id = null;
    this.permissions = [];
    this.permissionMask = 0;
    this.GetPermissionMask = function () {
    return this.permissionMask;
    }
//////////////////////////////////////////////////////////////////
    this.HasPermission = function (permission) {
            for (p in this.permissions) {
                if (p.CurrentPermission === permission) {
                    return true;
                }
        }
        return false;
    }
/////////////////////////////////////////////////////////////////
    this.AddPermission = function (permission) {
        this.permissions.push(permission);
        this.permissionMask = (this.permissionMask | permission.CurrentPermission);
    }

}

/////////////////////////////////////////////////////////////////

module.exports = User;