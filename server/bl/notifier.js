var Events = require('events').EventEmitter;
var Subscriber = require('./subscriber.js');
var Monitor = require('../../common/sync/monitor.js');
var CommonMethods = require('../../common/commonmethods.js');

var MessageFactory = require('./messagefactory.js');
var Utils = require('util');
var UserPermission = require('../../common/user/userpermission.js');
var Notifier = function (db,logger) {
    var _self = this;
    _self.Senders = {};
    _self.Providers = {};
    _self.dbService = db;
    var _moduleName = '[NOTIFIER]';
    var Logger = logger;
    var _monitor = new Monitor();
    
    function FlushMessgages(usersQueue,messagesArray){
        if (usersQueue !== undefined && usersQueue!== null) {
            for(var mc =0;mc< usersQueue.Messages.length;mc++)
                        {
                            messagesArray.push(usersQueue.Messages[mc]);
                        } 
        }
    }
    
    _self.RemoveUser = function(userId,callback){
        _monitor.Lock('subscribers',
                    function(monitorName){
                            var freshMessages = [];
                            var senders = _self.Senders[userId];
                            var providers = _self.Providers[userId];

                            if (CommonMethods.isNull(senders) === false) {
                                FlushMessgages(senders, freshMessages);
                            }
                            if (CommonMethods.isNull(providers) === false) {
                                FlushMessgages(providers, freshMessages);
                            }
                        });
        
    }
    _self.GetMessagesForUser = function (userId, packetId, callback) {
        Logger.debug('Try get messages for user ', userId,' packet ',packetId);
        _monitor.Down('subscribers',
                       function (monitorName) {
                           var freshMessages = [];
                           if (_self.Senders[userId] !== undefined && _self.Senders[userId] !== null) {
                               if (_self.Senders[userId].Messages.length > 0) {
                                   Logger.debug(_moduleName,'NOTIFIER-SENDERS:#',packetId,_self.Senders[userId].Messages[0]);
                                   freshMessages.push(_self.Senders[userId].Messages[0]);
                                   _self.Senders[userId].Messages[0].packetId = packetId;
                                   
                               }
                           }
                           else{
                                Logger.debug('No  SENDER messages found for user ',userId,' packet ',packetId);
                           }
                           if (_self.Providers[userId] !== undefined && _self.Providers[userId] !== null) {
                                 if (_self.Providers[userId].Messages.length > 0) {
                                    Logger.debug(_moduleName,'NOTIFIER-PROVIDERS:#',packetId,_self.Providers[userId].Messages[0]);
                                   freshMessages.push(_self.Providers[userId].Messages[0]);
                                   _self.Providers[userId].Messages[0].packetId = packetId;
                                   
                                }
                           }
                           else{
                            Logger.debug(_moduleName,'No  PROVIDER messages found for user ',userId,' packet ',packetId);
                           }
                           freshMessages.packetId = packetId;
                           _monitor.Release(monitorName);
                           if (callback !== null && callback !== undefined) {
                               callback(freshMessages);
                           }
                       });
    }
    _self.RemoveMessagesByPacketId = function(userId,packetId){
        Logger.debug(_moduleName,'BEGIN Removing message packet #',packetId,' for user #',userId);
        if (CommonMethods.isNull(_self.Senders[userId])===false) {
          if (CommonMethods.isNull(_self.Senders[userId].Messages)===false) {
           
                _self.Senders[userId].Messages.every(function(value,idx){
                        if (value.packetId === packetId) {
                            _self.Senders[userId].Messages.splice(idx, 1);
                        }
                        return true;
                    });
          }
        }
         if (CommonMethods.isNull(_self.Providers[userId])===false) {
          if (CommonMethods.isNull(_self.Providers[userId].Messages)===false) {
                _self.Providers[userId].Messages.every(function(value,idx){
                        if (value.packetId === packetId) {
                           _self.Providers[userId].Messages.splice(idx, 1);
                        }
                        return true;
                    });
          }
         }
    }
    _self.SubscribeUser = function (user) {
        _monitor.Lock('subscribers',
                      function () {
                          if (user.HasPermission(UserPermission.Sender)) {
                              if (_self.Senders[user.id] !== undefined) {
                                  _self.Senders[user.id].User = user;
                                  _self.Senders[user.id].Messages = [];

                              }
                              else {
                                  _self.Senders[user.id] = new Subscriber(user);
                              }
                          }
                          else if (user.HasPermission(UserPermission.Provider)) {
                              if (_self.Providers[user.id] != undefined) {
                                  _self.Providers[user.id].User = user;
                                  _self.Providers[user.id].Messages = [];
                              }
                              else {
                                  _self.Providers[user.id] = new Subscriber(user);
                                  _self.Providers[user.id].SubscribedSessions = [];
                              }
                          }
                      });
    }
    _self.on('session_created', function (session) {
        Logger.debug(_moduleName,'NOTIFIER: session_created:',session);
        _monitor.Lock('subscribers', function () {
            Logger.debug(_moduleName,'subscribers DOWN');
            Object.keys(_self.Providers).forEach(function (provider, idx) {
                var providerUserId = parseInt(provider);
                if (CommonMethods.isNull(session.InterestedProviders[providerUserId])===false) {
                    Logger.debug(_moduleName,'Provider#',provider,' will receive notification of request #',session.Id, '...');
                    _self.Providers[provider].SubscribedSessions.push(session.Id);
                    var message = MessageFactory.CreateSessionCreated(session,_self.Providers[provider]);
                    _self.Providers[provider].Messages.push(message);
                }
                else{
                    Logger.debug(_moduleName,'Provider#',provider,' will NOT receive notification of request #',session.Id,
                                  ' since the request does not match his interest requirements !');
                }
            });
            
        });
         Logger.debug(_moduleName,'subscribers UP');
    });
    _self.on('new_price',function(price,sessionOwnerUserId){
        Logger.debug(_moduleName,'new price was provided ',price);
            _monitor.Lock('subscribers',function(){
                  var message = MessageFactory.CreateNewPrice(price);
                  if (_self.Senders[sessionOwnerUserId]!== undefined && _self.Senders[sessionOwnerUserId]!== null) {
                     _self.Senders[sessionOwnerUserId].Messages.push(message);
                  }
                  
                  Logger.debug(_moduleName,'new_price accepted by notifier ',price,message,sessionOwnerUserId,' ...');
                });
        });
   
    _self.on('new_deal',function(dealDetails){
          Logger.info(_moduleName,'rounting deal:',dealDetails);
           _monitor.Lock('subscribers',function(){
                var senderMessage = MessageFactory.CreateNewDeal(dealDetails);
                 if (_self.Senders[dealDetails.SenderUser.userId]!== undefined && _self.Senders[dealDetails.SenderUser.userId]!== null) {
                    _self.Senders[dealDetails.SenderUser.userId].Messages.push(senderMessage);
                    Logger.debug(_moduleName,'Sender message added to message queue:',senderMessage);
                 }
                 
                 var providerMessage = MessageFactory.CreateNewDeal(dealDetails);
                 if (_self.Providers[dealDetails.ProviderUser.userId]!== undefined && _self.Providers[dealDetails.ProviderUser.userId]!== null) {
                    _self.Providers[dealDetails.ProviderUser.userId].Messages.push(providerMessage);
                    Logger.debug(_moduleName,'Provider message added to message queue:',providerMessage);
                 }
            });
        });
    _self.on('session_closed',function(session,reason){
            Logger.info(_moduleName,'Session:',session,' was closed because ',reason);
            
        });
    _self.on('price_canceled',function(price,reason){
            Logger.info(_moduleName,'Price ',price,'was canceled due to ',reason);
        });
    _self.on('price_rejected',function(sessionId,priceProviderId,reason){
        Logger.info(_moduleName,'Notifying about price of ',priceProviderId,' cancelation in session ',sessionId,' reason:',reason);
        _monitor.Lock('subscribers',function(){
                var rejectMessage = MessageFactory.CreateRejectPrice(sessionId,priceProviderId,reason);
                if (_self.Providers[priceProviderId]!== undefined && _self.Providers[priceProviderId]!== null){
                    _self.Providers[priceProviderId].Messages.push(rejectMessage);
                }
            });
        });
    
}
Utils.inherits(Notifier, Events);
module.exports = Notifier;