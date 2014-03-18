var date = new Date()
var CacheItem = function (data) {
    var CreateTime = date.getDate();
    var CreateDate = date.getTime();
    this.Data = data;
}
module.exports = CacheItem;