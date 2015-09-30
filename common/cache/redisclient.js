var redis = require('redis');
var LoggerFacade = require('../logger/facade.js');
var Monitor = require('../sync/monitor.js');

var RedisClient = function(logger){
    var loggerFacade = new LoggerFacade(logger,'REDIS');
    var _self = this;
    var client = new redis.createClient();
    var monitor = new Monitor();
    client.on('connect',function(){loggerFacade.debug('REDIS connected ...')});
    
    this.AddItem = function(key, item){
        var jsonItem = JSON.stringify(item);
        client.set(key,jsonItem);    
    }
    this.ReadItem = function(key, handler) {
        client.get(key,function(err,reply){
                if (err) {
                    loggerFacade.error('Failed to retrie value of key:',key,' !!!');
                    handler(undefined,0);
                }
                else{
                    var dataObject  = JSON.parse(reply);
                    handler(dataObject,0);
                }
            })
    }
    this.ReadArray = function(keys,handler){
            var items = [];
            monitor.Down('Completed',function(){
                var itemsProcessed =0;
                for(var kc=0; kc< keys.length;kc++){
                  _self.ReadItem(keys[kc],function(reply,idx){
                          monitor.Lock('ItemsArray',function(){
                                  items.push(reply);
                                  if (items.length === keys.length) {
                                    monitor.Release('Completed');
                                  }
                              });
                      });
                }
            });
            monitor.Lock('Completed',function(){
                                        handler(items);
                                    });
    }
    this.TakeArray = function (keys, handler) {
        var items = [];
        monitor.Down('Completed', function () {
            var itemsProcessed = 0;
            for (var kc = 0; kc < keys.length; kc++) {
                _self.TakeItem(keys[kc], function (reply, idx) {
                    monitor.Lock('ItemsArray', function () {
                        items.push(reply);
                        if (items.length === keys.length) {
                            monitor.Release('Completed');
                        }
                    });
                });
            }
        });
        monitor.Lock('Completed', function () {
            handler(items);
        });
    }
    this.TakeArrayByKeyPattern = function (keyPattern, handler) {
        monitor.Down('Completed', function () {
            client.keys(keyPattern, function (err, keys) {
                var items = [];
                    keys.every(function (value, idx) {
                        client.get(value, function (err, reply) {
                            client.del(value, function () { });
                            items.push(reply);
                        });
                        return true;
                    });
                    monitor.Release('Completed');
                    if (handler) {
                        handler(items);
                    }
            });
        });
        


        
    }
    this.TakeItem = function(key, handler) {
        _self.ReadItem(key,function(value,idx){
                client.del(key,function(err,reply){
                        if (err) {
                            loggerFacade.error('Failed to delete key:',key,' !!!');
                        }
                        else{
                            loggerFacade.debug('Key:',key,' successfyly deleted ...');
                        }
                        handler(value);
                    });
            });
    }
    
}
module.exports = RedisClient;