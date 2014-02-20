var express =require('express');
var path = require('path');
var controller = require('./controller.js');
var Request = require('./request.js');
var Response = require('./response.js');
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
	    if (controllers !== null && controllers !== undefined) {
	        this.controllers = controllers;

	    }
	}
////////////////////////////////////////////////////////////////////////
	ExpressHost.prototype.controllerHandler = function (controller, req, res) {
	    debugger;
	    var urlParts = url.parse(req.url, true, true);
	    var query = urlParts.query;
	    var pathName = urlParts.pathname.toUpperCase();
	    console.log(query);
	    console.log(pathName);
	    var request = new Request(query, req.body);
	    var response = new Response(res);
	    console.log(req);
	    controller.handler(request, response);
	}
////////////////////////////////////////////////////////////////////////
	ExpressHost.prototype.startListen = function () {
	    console.log('start listen ...');
	    for (var i = 0; i < this.controllers.length; i++) {
	        var ctrl = this.controllers[i];
	        console.log('listening %s on %s',ctrl.protocol, ctrl.path);
	        this.attachController(ctrl);
	    }
	}
////////////////////////////////////////////////////////////////////////////////////////
    ExpressHost.prototype.attachController = function(ctrl){
        var delegate = new ExpressHandlerDelegate(this, ctrl, this.controllerHandler);
         switch (ctrl.protocol) {
	            case 'GET':
                 this.expressServer.get(ctrl.path, delegate);
	                break;
	            case 'POST':
                 this.expressServer.post(ctrl.path, delegate);
	                break;
	        }

    }
//////////////////////////////////////////////////////////////////
module.exports = ExpressHost;