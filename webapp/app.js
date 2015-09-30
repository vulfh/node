var express = require('express');
var Controller = require('../common/controller.js');
var Login = require('./controllers/login.js');
var Common = require('./controllers/common.js');
var Updates = require('./controllers/updates.js');
var Logoff = require('./controllers/logoff.js');
var SubmitRequest = require('./controllers/submitrequest.js');
var ProvidePrice = require('./controllers/provideprice.js');
var Deal = require('./controllers/deal.js');
var Archive = require('./controllers/archive.js');
var Interest = require('./controllers/interest.js');
var Subscribe = require('./controllers/subscribe.js');
var TOS = require('./controllers/tos.js');
var FakeDB = require('../unittests/fakedb.js');
var Dal = require('../common/dal/db.js');
var ApiConnector = require('../server/apiconnector.js');
//var Logger = require ('../common/logger/logger.js');
var LoggerWrapper = require('../common/logger/loggerwrapper.js');
var Config = require('../common/configuration/config.js');
var Cluster = require('cluster');
var MkDirp = require('mkdirp');
var CommonMethods = require('../common/commonmethods.js');
var CacheWrapper = require('../common/cache/cachewrapper')
var Cache = require('../common/cache/cache.js')
var LandingPageHandler = require('./landingpages/lphandler.js');
var RedisClient = require('../common/cache/redisclient.js');

delete require.cache[require.resolve('../common/ExpressHost.js')];
var expressHost = require('../common/ExpressHost.js');

var config = undefined;
var isSingleMode = false;
var logFolder = __dirname+'/logs';

function initConfig(Logger) {
    config = new Config(Logger, process.env.SHIPPING_ENV);
}
function init(pid,logger) {
    //CommonMethods.initLogger(Logger,pid);
    var Logger = logger;
    if (logger === undefined || logger === null) {
        Logger = new LoggerWrapper(pid,logFolder);
    }
    initConfig(Logger);
    //var cacheWrapper = new CacheWrapper(new Cache(),Logger);
    var cacheWrapper = new CacheWrapper(new RedisClient(Logger),Logger);
    var app = new expressHost(3001,Logger,cacheWrapper);
    if (app === undefined)
        Logger.error('Failed to start WebApp')
    else
        Logger.info('WEB APP started...');
        
    
    
    app.addFolder('./webapp/scripts');
    app.addFolder('./webapp/pages');
    app.addFolder('./webapp');
    app.addFolder('./webapp/controls');
    app.addFolder('./webapp/images');
    app.addFolder('./webapp/styles/bootstrap');
    app.addFolder('./webapp/styles/bootstrap/css');
    app.addFolder('./webapp/styles/bootstrap/fonts');
    app.addFolder('./webapp/styles/bootstrap/js');
    
    
    app.setControllers([new Controller('/auth', new Login(new FakeDB(),new ApiConnector(Logger),Logger), 'POST')
                       ,new Controller('/request',new SubmitRequest(new FakeDB(),new ApiConnector(Logger),Logger),'POST')
                       ,new Controller('/updates',new Updates(new FakeDB(),new ApiConnector(Logger),Logger),'GET')
                       ,new Controller('/provideprice',new ProvidePrice(new FakeDB(),new ApiConnector(Logger),Logger),'POST')
                       ,new Controller('/deal',new Deal(new FakeDB(),new ApiConnector(Logger),Logger),'POST')
                       ,new Controller('/logoff',new Logoff(new FakeDB(),new ApiConnector(Logger),Logger),'POST')
                       ,new Controller('/common',new Common(new Dal(Logger,config),new ApiConnector(Logger),config,Logger),'GET')
                       ,new Controller ('/archive',new Archive(new Dal(Logger,config),new ApiConnector(Logger),Logger),'GET')
                       ,new Controller('/interest',new Interest(new Dal(Logger,config),new ApiConnector(Logger),Logger),'POST')
                       ,new Controller('/subscribe',new Subscribe(new Dal(Logger,config),new ApiConnector(Logger),config,Logger),['POST','GET'])
                       ,new Controller('/tos',new TOS(new Dal(Logger,config),new ApiConnector(Logger),config,Logger),'POST')
                       ,new Controller('/landing',new LandingPageHandler(new Dal(Logger,config),new ApiConnector(Logger)),'GET')]);
    app.start();

}


if (Cluster.isMaster) {
        var Logger = new LoggerWrapper('MASTER',logFolder)
        //CommonMethods.initLogger(Logger,'MASTER');
        initConfig(Logger);
        if (config.get('GENERAL','client_mode') === 'SINGLE') {
            isSingleMode = true;
        }
        if (isSingleMode === true) {
            init('SINGLE',Logger);
        }
        else{
            var cpuCounter = require('os').cpus().length;
            Logger.info('Starting application in ',cpuCounter,' processes');
                for(var i=0;i<cpuCounter;i++){
                    Cluster.fork();
                }
        }
}
else{
    init(process.pid);
}