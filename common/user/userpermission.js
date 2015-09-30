var UserPermission = function (permission, restricted) {
    var self = this;
    
    this.Restricted =((restricted !== null && restricted !== undefined) ? restricted : false);

    this.CurrentPermission = self.Regular;
    if (permission !== undefined && permission !== null) {
        self.CurrentPermission = permission;
    }

}


UserPermission.Regular = 1;
UserPermission.Provider= 2;
UserPermission.Sender = 4;
UserPermission.Admin = 8;

UserPermission.prototype.CheckPermissionByMask = function (mask) {
    if (this.CurrentPermission !== null && this.CurrentPermission !== undefined) {
        if (this.Restricted === true) {
            if ((this.CurrentPermission | mask) === this.CurrentPermission) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            if ((this.CurrentPermission & mask) === this.CurrentPermission) {
                return true;
            }
            else {
                return false;
            }
        }
    }
    return false;
}
UserPermission.prototype.HasPermission = function (permission) {
    if (this.CurrentPermission !== null && this.CurrentPermission !== undefined) {
        if (this.Restricted !== true) {
            if ((this.CurrentPermission & permission) === this.CurrentPermission) {
                return true;
            }
            else {
                return false;
            } 
        }
        else{
           if ((this.CurrentPermission | permission) === this.CurrentPermission) {
                return true;
            }
            else {
                return false;
            }  
        }
    }
    else {
        return false;

    }

}

module.exports = UserPermission;