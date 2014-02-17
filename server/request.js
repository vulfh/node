var Request = function (queryParams) {
    this.Post = [];
    this.Query = [];
    this.QueryParams = queryParams;
    console.log('Start passing through the params of the query ...');
    for (var param in this.QueryParams) {
        this.AddQueryParam(param, this.QueryParams[param]);
    }
}
Request.prototype.AddQueryParam = function (key,value) {
    
    console.log(" adding param %s",key);
    this.Query.push({ key: value });
}
module.exports = Request;