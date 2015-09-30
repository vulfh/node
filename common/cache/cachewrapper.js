var CacheWrapper = function(cacheImplementation,logger){
    var _self = this;
    var _logger = logger;
    var _cacheSvc = cacheImplementation;
    this.AddItem = function(key, item){
        _cacheSvc.AddItem(key,item);    
    }
    this.ReadItem = function(key, handler) {
        _cacheSvc.ReadItem(key,handler);
    }
    this.ReadArray = function(keys,handler){
        _cacheSvc.ReadArray(keys,handler);
    }
    this.TakeItem = function(key, handler) {
        _cacheSvc.TakeItem(key,handler);
    }
    this.TakeArrayByKeyPattern = function(keyPattern,handler){
        _cacheSvc.TakeArrayByKeyPattern(keyPattern,handler);
    }
}
module.exports = CacheWrapper;