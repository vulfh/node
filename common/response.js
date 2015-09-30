var Response = function (res,session) {
    var _self = this;
    this.responseObject = res;
    this.session  = session;
    this.id = Math.round( Math.random()*1000000);
     this.render =function (){
        var args = Array.prototype.slice.call(arguments);
        if (typeof(this.responseObject.render) === 'function') {
            this.responseObject.render.apply(this.responseObject,args);
        }
    }
    this.cookie =function (){
        var args = Array.prototype.slice.call(arguments);
        if (typeof(this.responseObject.cookie) === 'function') {
            this.responseObject.cookie.apply(this.responseObject,args);
        }
    }
    this.writeHead = function () {
        var args = Array.prototype.slice.call(arguments);
        if (typeof (this.responseObject.writeHead) === 'function') {
            this.responseObject.writeHead.apply(this.responseObject, args);
        }
    }
    this.send =function (){
        var args = Array.prototype.slice.call(arguments);
        _self.session.flush(this);
        this.responseObject.send.apply(this.responseObject, args);
    }
    this.end = function () {
        var args = Array.prototype.slice.call(arguments);
        if (typeof (this.responseObject.end) === 'function') {
            this.responseObject.end.apply(this.responseObject, args);
        }
    }
}
module.exports = Response;