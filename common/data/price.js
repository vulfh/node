var Moment = require('moment');
var Price = function(priceId,providerUserId,sessionId,price,remark){
    var _self = this;
    _self.UserId = parseInt(providerUserId);
    _self.Company = undefined;
    _self.UserName = undefined;
    _self.Id  = parseInt(priceId);
    _self.SessionId = parseInt(sessionId);
    _self.Markup =0;
    _self.Price = parseFloat(price);
    _self.ProvidedTS= new Date();
    _self.Remark=remark;
    _self.ProvidedDate = Moment(_self.ProvidedTS).local().format('DD/MM/YYYY');
    _self.ProvidedTime = Moment(_self.ProvidedTS).local().format('hh:mm:ss');
    
}
module.exports = Price;