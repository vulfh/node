var Permission = require('./../user/userpermission.js');
var Item = function (caption, link, id, permissions) {
    var self = this;
    this.Link = link;
    this.Id = id;
    this.Caption = caption;
    this.NeededPermissions = permissions;
    this.NeededPermissionMask = 0;
    this.SubItems = [];
    if (this.NeededPermissions !== null && this.NeededPermissions !== undefined)
        this.NeededPermissions.forEach(function (p) {
            self.NeededPermissionMask = (self.NeededPermissionMask | p.CurrentPermission);
        });
}
Item.prototype.CheckPermissionMask = function (mask) {
    var hasPermission = false;
    for (i = 0; i < this.NeededPermissions.length; i++) {
        hasPermission = (hasPermission || this.NeededPermissions[i].CheckPermissionByMask(mask));
    }
    return hasPermission;
}
module.exports = Item;