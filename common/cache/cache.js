var CacheItem = require('./cacheitem.js');
var Cache = function () {
    var Keys = [];
    var Items = [];
    var WorkingOnCache = false;
    
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
    this.TakeItem = function(key, handler) {
    ReadItem(key, function (item, index) {
    RemoveItemByIndex(index);
    if (handler instanceof Function) {
    handler(item.Data, index);
    }
    });

    }
    this.RemoveItemByIndex = function(index) {
    Keys.splice(index, 0);
    Items.splice(index, 0);
    }
   
}
module.exports = Cache;