var Monitor = require('../../common/sync/monitor.js');
var Price = require('../../common/data/price.js');
var LoggerFacade = require('../../common/logger/facade.js');
var CommonMethods = require('../../common/commonmethods.js');
var SessionManager = function (notifier, db,logger) {
    var _self = this;

    var SessionListSync = new Monitor();
    var DbSvc = db;
    var Logger = new LoggerFacade(logger,'SESSION-MANAGER');
    _self.Notifier = notifier;
    _self.Sessions = {};
    
    function RemoveSessionsOfUser(userId) {
        Object.keys(_self.Sessions).forEach(function(sessionId,idx){
                if (_self.Sessions[sessionId].OwnerUserId === userId) {
                    var session =  _self.Sessions[sessionId];
                   delete _self.Sessions[sessionId];
                    _self.Notifier.emit('session_closed',session,'יוזם הבקשה התנתק מהממערכת.');
                }
            });
    }
    function RemovePricesOfUser(userId) {
        Object.keys(_self.Sessions).forEach(function(sessionId,idx){
            Object.keys(_self.Sessions[sessionId]).forEach(function(priceProviderId,idx){
                    if (priceProviderId === userId) {
                        CancelPrice(sessionId,priceProviderId,'ספק התנתק מהמערכת!','מחיר התבטל!');
                    }
                });
            });
    }
    function GetSessionOwnerUserId(sessionId) {
        if (_self.Sessions[sessionId]!== undefined && _self.Sessions[sessionId]!==null) {
            return _self.Sessions[sessionId].OwnerUserId;
        }
        else{
            return undefined;
        }
    }
    function GetUserIdByPriceId(sessionId,priceId){
        var providerUserId = undefined;
        if (_self.Sessions[sessionId]!==null && _self.Sessions[sessionId]!==undefined) {
            Object.keys(_self.Sessions[sessionId]).forEach(function(userId,idx){
                        if(_self.Sessions[sessionId][userId].Price !== undefined && _self.Sessions[sessionId][userId].Price!== null){
                            var price = _self.Sessions[sessionId][userId];
                            if (price.Id=== priceId) {
                                providerUserId = price.UserId;
                            }
                        }
                });
        }
        return providerUserId;
    }
    
    function GetAllPricesOfSession(sessionId){
        var prices = [];
         Object.keys(_self.Sessions[sessionId]).forEach(function(userId,idx){
                        if(_self.Sessions[sessionId][userId].Price !== undefined && _self.Sessions[sessionId][userId].Price!== null){
                            var price = _self.Sessions[sessionId][userId];
                            if (price.SessionId=== sessionId) {
                                prices.push(price);
                            }
                        }
                });
         return prices;
        
    }
    
    function CancelPrice(sessionId,priceProviderId,cancelReason,rejectReason){
        _self.Notifier.emit('price_canceled',sessionId,_self.Sessions[sessionId][priceProviderId].Id,cancelReason);
        _self.Notifier.emit('price_rejected',sessionId,priceProviderId,rejectReason);
        delete _self.Sessions[sessionId][priceProviderId] ;
    }
    this.RemoveSessionAndPricesOfUser = function(userId){
        SessionListSync.Lock("Sessions",function(monitorName){
                RemoveSessionsOfUser(userId);
                RemovePricesOfUser(userId);
            });
    }
    this.AddSession = function (session) {
        SessionListSync.Down("Sessions", function (monitorName) {
            Logger.debug("Sessions DOWN");
            if (_self.Sessions[session.Id] === undefined) {
                _self.Sessions[session.Id] = session;
            }
            SessionListSync.Release(monitorName);
            Logger.debug('Sessions UP');
            _self.Notifier.emit('session_created', session);
        });
    }
    this.ProvidePrice = function(priceProviderUserId,price){
        SessionListSync.Lock("Sessions",function(){
            if (_self.Sessions[price.SessionId]!== undefined && _self.Sessions[price.SessionId]!==null) {
                 _self.Sessions[price.SessionId][price.UserId] = price;
            }
            var sessionOwnerUserId = GetSessionOwnerUserId(price.SessionId);
            _self.Notifier.emit('new_price',price,sessionOwnerUserId);
            });
        
    }
    this.RejectSession = function(priceProviderUserId,sessionId){
        SessionListSync.Lock('Sessions',function(){
            
            });
    }
    this.Deal = function(deal){
            SessionListSync.Lock("Sessions",function(){
                   _self.Notifier.emit('new_deal',deal);
                   var prices = GetAllPricesOfSession(deal.SessionId);
                   for (var i =0;i<prices.length;i++) {
                    if (prices[i].Id!==deal.Price.Id) {
                      CancelPrice(deal.SessionId,prices[i].UserId,'','מצטערים! התקבלה הצעה של ספק אחר.תודה.');
                    }
                    else{
                        CancelPrice(deal.SessionId,prices[i].UserId,'','בקשה נסגרה.');                    
                    }
                   }
                });        
    }
  ////////////////////////////////FACTORY  
    this.CreateSession = function (sendingRequest, onSessionCreatedCallBack) {
        DbSvc.SubmitSendingRequest(sendingRequest, function (session) {
            session.OwnerUserId = sendingRequest.request.OwnerUserId;
            DbSvc.GetInterestedProviders(session.Id,function onError(err){},
                                                    function onResult(providers){
                    session.InterestedProviders = providers;
                    if (onSessionCreatedCallBack !== undefined && onSessionCreatedCallBack !== null) {
                       onSessionCreatedCallBack(session);
                       }
                });
           
        });
    }
    this.CreatePrice = function(providerUserId,sessionId,price,remark,onPriceSavedCallback){
        DbSvc.SavePrice(providerUserId,sessionId,price,remark,function onDone(priceDetails){
                if (onPriceSavedCallback !== undefined && onPriceSavedCallback !== null) {
                    onPriceSavedCallback(priceDetails);
                }
            });
    }
    this.CreateDeal = function(sessionId,priceId,onDealSavedCallback){
        var request = undefined;
        
        SessionListSync.Down("Sessions",function(){
                Logger.debug('CD: Fetch user by priceId:',priceId);
                var userId = GetUserIdByPriceId(sessionId,priceId);
                var session = _self.Sessions[sessionId]
                
                var price = session[userId];
                SessionListSync.Release("Sessions");
                Logger.debug('CD: fetched session:',session,'Saving the deal to DB !');
                DbSvc.SaveDeal(session,price,function onDone(dealDetials){
                    if (onDealSavedCallback!== undefined && onDealSavedCallback!==null) {
                        dealDetials.Price = price;
                        dealDetials.Constraints = session.SendingRequest.request.constraints;
                        onDealSavedCallback(dealDetials);
                    }
                    });
                
        })
    }
}

module.exports = SessionManager;