var express = require('express');
var exphbs  = require('express-handlebars');
var path = require('path');
var http = require('http');
var controller = require('./controller.js');
var Request = require('./request.js');
var Response = require('./response.js');
var Cache = require('./cache/cache.js');
var Monitor = require('./sync/monitor.js');
var url = require('url');
var Cluster = require('cluster');
var session = require('express-session');
var bodyParser = require('body-parser');
function ExpressHandlerDelegate(host,ctrl,handler){
    
    
    return function (req, res) {
        host.controllerHandler(ctrl,req, res);
    }
    
}

var ExpressHost = function (port,logger,cache) {
    var _self = this;
    this.port = port;
    this.folders = [];
    this.controllers = [];
    InitHost(logger,cache);
    
 function InitHost(logger,cache){
     var hbs = exphbs.create({ /* config */ });
    _self.requestSync = new Monitor();
    _self.expressApp = express();
   
   // _self.expressApp.use(express.urlencoded());
    //_self.expressApp.set('views',__dirname+'../webapp/views');
    
    

  _self.expressApp.use(session({ resave: true, saveUninitialized: true, 
                      secret: 'uwotm8' }));

    // parse application/json
    _self.expressApp.use(bodyParser.json());                        

    // parse application/x-www-form-urlencoded
    _self.expressApp.use(bodyParser.urlencoded({ extended: true }));



    _self.expressApp.engine('handlebars', exphbs({defaultLayout: 'main'}));
    _self.expressApp.set('view engine', 'handlebars');
    _self.expressApp.use(function (error, req, res, next) {
	if (!error) {
	  next();
	} else {
	    console.error(error.stack);
	    res.send(500);
	}
      });
    _self.Cache = cache;
    _self.Logger=logger;
    _self.start = function (port) {
        if (port !== undefined && port != null)
            _self.port = port;
        for (var i = 0; i < _self.folders.length; i++) {
            _self.expressApp.use(express.static(this.folders[i]));
        }
        _self.expressApp.listen(_self.port);
        //start listen to dynamic urls
        _self.startListen();
    }
    _self.startClustered = function(port){
	if (Cluster.isMaster) {
	    var cpuCounter = require('os').cpus().length;
	    for(var i=0;i<cpuCounter;i++){
		Cluster.fork();
	    }
	}
	else{
	    _self.start(port);
	}
    }
    var responseCounter = 0;
    
    _self.controllerHandler = function (controller, req, res) {
				 var urlParts = url.parse(req.url, true, true);
						var query = urlParts.query;
						var pathName = urlParts.pathname.toUpperCase();
						// console.log(query);
						//console.log(pathName);
						var request = new Request(query,req, req.session, controller.Cache);
						request.release = function (){
						    }
						var response = new Response(res);
						response.id = responseCounter++;
						// console.log(req);
						controller.handler(request, response);
	}
}   
    
}
////////PROTOTYPE//////////////////////////////////////////////////////////
ExpressHost.prototype.addFolder =  function(folderName){
		this.folders.push(path.join(path.join(__dirname,'..'),folderName));
	}
/////////////////////////////////////////////////////////////////////////////
ExpressHost.prototype.setControllers = function (controllers, errHandler) {
	    if (controllers !== null && controllers !== undefined) {
	        this.controllers = controllers;

	    }
	}
////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////
ExpressHost.prototype.startListen = function () {
	    this.Logger.info('start listen ...');
	    for (var i = 0; i < this.controllers.length; i++) {
	        var ctrl = this.controllers[i];
	        ctrl.Cache = this.Cache;
	        this.Logger.info('listening ',ctrl.protocol,' on ',  ctrl.path);
	        this.attachController(ctrl);
	    }
	}
////////////////////////////////////////////////////////////////////////////////////////
ExpressHost.prototype.attachControllerByProtocol = function(ctrl,protocol){
    var delegate = new ExpressHandlerDelegate(this, ctrl, this.controllerHandler);
         switch (protocol) {
	            case 'GET':
                 this.expressApp.get(ctrl.path, delegate);
	                break;
	            case 'POST':
                 this.expressApp.post(ctrl.path, delegate);
	                break;
	        }
}
////////////////////////////////////////////////////////////////////////////////////////
ExpressHost.prototype.attachController = function(ctrl){
        if (Array.isArray(ctrl.protocol)) {
	    var self = this;
	   ctrl.protocol.every(function(value){
		self.attachControllerByProtocol(ctrl,value);
		return true;
	    });
	}
	else{
	   this.attachControllerByProtocol(ctrl,ctrl.protocol); 
	}

}
//////////////////////////////////////////////////////////////////
module.exports = ExpressHost;