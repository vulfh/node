var date = new Date()
var CacheItem = function (data) {
    var CreateTime = date.getTime();
    var CreateDate = date.getDate();
    this.Data = data;
}
module.exports = CacheItem;