var Subscriber = function (user) {
    var _self = this;
    _self.User = user;
    _self.Messages = new Array();
}
module.exports = Subscriber;