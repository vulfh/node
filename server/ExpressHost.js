var express =require('express');
var path = require('path');
var controller = require('./controller.js')
var Request = require('./request.js');
var url = require('url');

function ExpressHandlerDelegate(host,ctrl,handler){
    return function (req, res) {
        host.controllerHandler(ctrl,req, res);
    }
}

var ExpressHost = function (port) {
    this._self = this;
    this.port = port;
    this.folders = [];
    this.controllers = [];

    this.expressServer = express();
    this.expressServer.use(express.bodyParser());

    this.start = function (port) {
        if (port !== undefined && port != null)
            this.port = port;
        for (var i = 0; i < this.folders.length; i++) {
            this.expressServer.use(express.static(this.folders[i]));
        }
        this.expressServer.listen(this.port);
        //start listne to dynamic urls
        this.startListen();
    }
}
////////PROTOTYPE//////////////////////////////////////////////////////////
ExpressHost.prototype.addFolder =  function(folderName){
		this.folders.push(path.join(__dirname,folderName));
	}
/////////////////////////////////////////////////////////////////////////////
	ExpressHost.prototype.setControllers = function (controllers, errHandler) {
	    debugger;
	    if (controllers !== null && controllers !== undefined) {
	        this.controllers = controllers;

	    }
	}
////////////////////////////////////////////////////////////////////////
	ExpressHost.prototype.controllerHandler = function (controller,req, res) {
	    var urlParts = url.parse(req.url, true, true);
	    var query = urlParts.query;
	    var pathName = urlParts.pathname.toUpperCase();
	    console.log(query);
	    console.log(pathName);
	    var req = new Request(query);
	    console.log(req);
	    debugger;   
        controller.handler(req, null);
	}
ExpressHost.prototype.startListen = function () {
    console.log('start listen ...');
    for (var i = 0; i < this.controllers.length; i++) {
        var ctrl = this.controllers[i];
        console.log('listening on %s', ctrl.path);
        this.expressServer.get(ctrl.path, new ExpressHandlerDelegate(this,ctrl,this.controllerHandler));
    }
}
//////////////////////////////////////////////////////////////////
module.exports = ExpressHost;