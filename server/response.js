var Response = function (res) {
    this.responseObject = res;
    this.send =function (){
        var args = Array.prototype.slice.call(arguments);
        this.responseObject.send.apply(this.responseObject, args);
    }
}
module.exports = Response;