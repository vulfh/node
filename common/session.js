var CommonMethods = require('./commonmethods.js');
var Session = function(cache,logger,req){
    var _self = this;
    var _cache = cache;
    var _logger = logger;
    var _storage = {};
    var _token;
    
    function createItemKey(key) {
        return key + '@' + _token;
    }

    _self.add = function(key,value){
        var cacheKey = createItemKey(key);
        _cache.AddItem(cacheKey, value);
    }
    _self.get = function (key, callback) {
        var cacheKey = createItemKey(key);
        var cacheValue;
        _cache.ReadItem(cacheKey, function (value) {
            cacheValue = value;
            if (typeof (callback) === 'function') {
                callback(value);
            }
        });
        
        
    }
    this.close = function(){
        _cache.TakeArrayByKeyPattern('*@' + _token, function () { });
    }
    this.getToken = function(){
        return _token;
    }
    this.flush = function(res){
        res.cookie('mersh-token',_token,{ maxAge: 900000, httpOnly: true,secure:false});
    }
    this.init = function(next) {
      if (CommonMethods.isNull(req.Cookies['mersh-token'])=== false) {
        _token = req.Cookies['mersh-token'];
      }
      else if (CommonMethods.isNull(req.GetPostParam('mersh-token'))===false) {
       _token = req.GetPostParam('mersh-token');
      }
      else{
        _token = CommonMethods.guid();
      }
      if (typeof (next) === 'function') {
          next();
      }
    }
}
module.exports = Session;