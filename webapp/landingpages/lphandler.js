var Moment = require('moment');
var Proxy = require('http-proxy');
var LandingPageHandler = function(db,apiConnector,logger){
    var _loggerSvc = logger;
    var _dalSvc = db;
    var _self = this;
    var apiSvc = apiConnector;
    var _proxy = Proxy.createProxyServer({target:'http://54.186.101.79:5000/html/'});
    
    function getLandingPage(req,res,callback){
        if (typeof(callback)==='function') {
            end(res,'home');
        }
    }
    
    
    function begin(req,res) {
       // getLandingPage(req,res,end);
       _proxy.web(req,res,{target:'http://54.186.101.79:5000/html/'});
       
    }
    
    function end(res,viewName) {
        res.render(viewName);
    }
    return function(req,res){
        begin(req,res);
    }
}
module.exports = LandingPageHandler;