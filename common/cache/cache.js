var CacheItem = require('./cacheitem.js');
var Cache = function () {
    var _self = this;
    var Keys = [];
    var Items = [];
    var WorkingOnCache = false;
//////////////////////////////////////////////////////////////////////////////
    this.AddItem = function(key, item) {
                                if (WorkingOnCache === false) {
                                    var cacheItem = new CacheItem(item);
                                    WorkingOnCache = true;
                                    Keys.push(key);
                                    Items.push(cacheItem);
                                    WorkingOnCache = false;
                                }
                                else {
                                    setTimeout(AddItem, 100, key, item);
                                }
                        }
//////////////////////////////////////////////////////////////////////////////
      this.ReadItem = function(key, handler) {
                            var item = undefined;
                            var index = -1;
                            if (WorkingOnCache === true) {
                                setTimeout(ReadItem, 100, key, handler);
                                return;
                            }
                            WorkingOnCache = true;
                            for (var i = 0; i < Keys.length; i++) {
                                if (Keys[i] === key) {
                                item = Items[i];
                                index = i;
                                break;
                            }
                        }
                        WorkingOnCache = false;
                        if (handler instanceof Function)
                        handler(item.Data, index);
      }
///////////////////////////////////////////////////////////////////////////////
      this.ReadArray = function(keys,handler){
                        var resultItems = [];
                        if (WorkingOnCache === true) {
                                setTimeout(ReadArray, 100, key, handler);
                                return;
                            }
                            WorkingOnCache = true;
                            for(var kc=0; kc< keys.length;kc++){
                               for (var i = 0; i < Keys.length; i++) {
                                    if (Keys[i] === keys[kc]) {
                                        resultItems.push(Items[i].Data);
                                        break;
                                }  
                            }
                        }
                        WorkingOnCache = false;
                        if (handler instanceof Function)
                            handler(resultItems);
        }
//////////////////////////////////////////////////////////////////////////////
    this.TakeItem = function(key, handler) {
                            _self.ReadItem(key, function (item, index) {
                            _self.RemoveItemByIndex(index);
                            if (handler instanceof Function) {
                                handler(item, index);
                            }
                            });

                        }
    //////////////////////////////////////////////////////////////////////////
        this.RemoveItemByIndex = function(index) {
                Keys.splice(index, 0);
                Items.splice(index, 0);
          }
 }
module.exports = Cache;