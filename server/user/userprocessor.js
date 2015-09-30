var Utils = require('util');
var User = require('../../common/user/user.js');
var UserPermission = require('../../common/user/userpermission.js');
var UserPerspective = require('../../common/user/perspective.js');
var UserProcessor = {
    processUser: function (user, notifier,cache, callback) {
        UserProcessor.addPerspectiveList(user,notifier,cache);
        if (typeof (callback) === 'function') {
            callback(user);
        }
    },

    addPerspectiveList:function(user,notifier,cache){
    if (user!== undefined && user !== null) {
        user.perspectives = [];
        if(user.HasPermission(UserPermission.Sender)){
            user.perspectives.push(UserPerspective.SENDER);
        }
        if (user.HasPermission(UserPermission.Provider)) {
            user.perspectives.push(UserPerspective.PROVIDER);
        }
        notifier.SubscribeUser(user);
        cache.AddItem(user.id, user);
    }
}
};
module.exports = UserProcessor;