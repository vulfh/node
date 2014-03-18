var Controller = function (path,handler,protocol) {
    this.path = path;
    this.handler = handler;
    this.protocol = protocol;
}

module.exports = Controller;