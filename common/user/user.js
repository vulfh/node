var UserPermission = require('./userpermission.js');
var Events = require('events').EventEmitter;
var Utils = require('util');
var User = function () {
    this.userName = null;
    this.password = null;
    this.firstName = null;
    this.lastName =null;
    this.streetId = null;
    this.cityId = null;
    this.house = null;
    this.appartment = null;
    this.id = null;
    this.permissions = [];
    this.permissionMask = 0;
    this.GetPermissionMask = function () {
        return this.permissionMask;
    }
    //////////////////////////////////////////////////////////////////
    this.HasPermission = function (permission) {
        
        for(var pc =0 ; pc<this.permissions.length;pc++){
            if(this.permissions[pc].CurrentPermission === permission)
                return true
        }

        return false;
    }
    /////////////////////////////////////////////////////////////////
    this.AddPermission = function (permission) {
        this.permissions.push(permission);
        this.permissionMask = (this.permissionMask | permission.CurrentPermission);
    }
    ///////////////////////////EVENTS///////////////////////////////////////
    this.on('new_request', function (listener, message) {

    });

}

/////////////////////////////////////////////////////////////////
Utils.inherits(User, Events);
module.exports = User;