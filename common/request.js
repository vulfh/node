var CommonMethods = require('./commonmethods.js');
var Request = function (queryParams, postBody, cache,cookies) {
    this.PostParams = postBody;
    this.Query = {};
    this.QueryParams  = queryParams;
    this.Cache = cache;
    this.Cookies = cookies;
   

    console.log('Start passing through the params of the query ...');
    for (var param in this.QueryParams) {
        this.AddQueryParam(param, this.QueryParams[param]);
    }
    
}
Request.prototype.AddQueryParam = function (key,value) {
    
    console.log(" adding param %s : %s",key,value);
    this.Query[key]=value;
}
Request.prototype.GetQueryParam = function (name) {
    if (this.Query !== null && this.Query !== undefined) {
       if (this.Query[name] !== null && this.Query[name] !== undefined)
            return this.Query[name];
        else
            return null;
    }
    else {
        return null;
    }
}
Request.prototype.GetPostParam = function (name) {
    if (this.PostParams !== null && this.PostParams !== undefined) {
        if (this.PostParams[name] !== null && this.PostParams[name] !== undefined)
            return this.PostParams[name];
        else
            return null;
    }
    else {
        return null;
    }

}
module.exports = Request;