var Moment = require('moment');
var DealDetails = function(){
    var _self = this;
    _self.Id = undefined;
    _self.SenderId = undefined;
    _self.ProviderId = undefined;
    _self.SenderUser = undefined;
    _self.ProviderUser = undefined;
    _self.Request = undefined;
    _self.Price = undefined;
    _self.SessionId = undefined;
    _self.DealTS = new Date();
    _self.DealDate = Moment(_self.DealTS).local().format('DD/MM/YYYY');
    _self.DealTime = Moment(_self.DealTS).local().format('hh:mm:ss');
    _self.ProviderRemark = undefined;
}
module.exports = DealDetails;