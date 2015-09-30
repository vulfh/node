var express = require('express');
var Controller = require('../common/controller.js');
var Authentication = require('./user/authentication.js');
var Logoff = require('./user/logoff.js');
var SubmitSendingRequest = require('./bl/submitsendingrequest.js');
var ProvidePrice = require('./bl/provideprice.js');
var Deal = require('./bl/deal.js');
var GetUpdates = require('./bl/getupdates.js');
var Archive = require('./bl/archive/archive.js');
var Interest = require('./bl/interest/interest.js');
var Subscription = require('./bl/subscription/subscribe.js');
var TOS = require('./bl/tos/tos.js');
var Notifier = require('./bl/notifier.js');
var SessionManager = require('./bl/sessionmanager.js');
var FakeDB = require('../unittests/fakedb.js');
var Dal = require('../common/dal/db.js');
var LoggerWrapper = require('../common/logger/loggerwrapper.js');
var Config = require('../common/configuration/config.js');
var Cluster = require('cluster');
var MkDirp = require('mkdirp');
var CommonMethods = require('../common/commonmethods.js');
var CacheWrapper = require('../common/cache/cachewrapper.js');
var Cache = require('../common/cache/cache.js');
var RedisCache = require('../common/cache/redisclient.js')
delete require.cache[require.resolve('../common/ExpressHost.js')];

var expressHost = require('../common/ExpressHost.js');
var config = undefined;
var isSingleMode = false;
var logFolder = __dirname+'/logs';
function initConfig(Logger) {
    config = new Config(Logger, process.env.SHIPPING_ENV);
}
function init(pid,logger){
    
     var Logger = logger;
    if (CommonMethods.isNull(Logger) === true) {
        Logger = new LoggerWrapper(pid,logFolder);
    }
    initConfig(Logger);
  //  var cacheWrapper = new CacheWrapper(new Cache(),Logger);
    var cacheWrapper = new CacheWrapper(new RedisCache(Logger),Logger);
    var app = new expressHost(3002,Logger,cacheWrapper);
    if (app === undefined)
        Logger.error('API SERVER failed to start...');
    else
        Logger.info('API SERVER started ...')
    
    var notifier = new Notifier(new Dal(Logger,config),Logger);
    
    
    var authControl = new Authentication(new Dal(Logger,config),notifier,Logger);
    var sessionManager = new SessionManager(notifier, new Dal(Logger,config),Logger);
    var providePriceControl = new ProvidePrice(new Dal(Logger,config),notifier,sessionManager,Logger);
    var dealControl = new Deal(new Dal(Logger,config),notifier,sessionManager,Logger);
    var submitRequestControl =  new SubmitSendingRequest(new Dal(Logger,config),notifier,sessionManager,Logger);
    var getUpdatesControl = new GetUpdates(new Dal(Logger,config), notifier,Logger);
    var logoffControl = new Logoff(new Dal(Logger,config),notifier,sessionManager,Logger);
    var archiveController = new Archive(new Dal(Logger,config),Logger);
    var interestController = new Interest(new Dal(Logger,config),Logger);
    var subscriptionController = new Subscription(new Dal(Logger,config),Logger,config,notifier);
    var tosController = new TOS(new Dal(Logger,config),Logger,config);
    app.setControllers([new Controller('/authenticate',authControl,'POST')
                       ,new Controller('/submitrequest',submitRequestControl,'POST')
                       ,new Controller('/getupdates',getUpdatesControl,'POST')
                       ,new Controller('/provideprice',providePriceControl,'POST')
                       ,new Controller('/deal',dealControl,'POST')
                       ,new Controller('/logoff',logoffControl,'POST')
                       ,new Controller('/archive',archiveController,'POST')
                       ,new Controller('/interest',interestController,'POST')
                       ,new Controller('/subscribe',subscriptionController,'POST')
                       ,new Controller('/tos',tosController,['POST','GET'])]
                       , function (err) { });
    Logger.info('RUNNING SINGLE MODE ',isSingleMode);
    app.start();
}


    if (Cluster.isMaster) {
        var Logger = new LoggerWrapper('MASTER',logFolder)
        initConfig(Logger);
        if (config.get('GENERAL','server_mode') === 'SINGLE') {
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
        
        init(process.pid,Logger);
    }

