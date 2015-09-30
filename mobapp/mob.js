var express = require('express');
var Controller = require('../common/controller.js');
var Login = require('./auth.js');
var Logoff = require('./logoff.js');

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
var RedisClient = require('../common/cache/redisclient.js');

delete require.cache[require.resolve('../common/ExpressHost.js')];
var expressHost = require('../common/ExpressHost.js');

var config = undefined;
var isSingleMode = false;
var logFolder = __dirname + '/logs';

function initConfig(Logger) {
    config = new Config(Logger, process.env.SHIPPING_ENV);
}
function init(pid, logger) {
    //CommonMethods.initLogger(Logger,pid);
    var Logger = logger;
    if (logger === undefined || logger === null) {
        Logger = new LoggerWrapper(pid, logFolder);
    }
    initConfig(Logger);
    //var cacheWrapper = new CacheWrapper(new Cache(),Logger);
    var cacheWrapper = new CacheWrapper(new RedisClient(Logger), Logger);
    var app = new expressHost(3003, Logger, cacheWrapper);
    if (app === undefined)
        Logger.error('Failed to start MOBILE APP')
    else
        Logger.info('MOBILE APP started...');

    app.setControllers([new Controller('/auth', new Login(new FakeDB(), new ApiConnector(Logger), Logger), 'POST')
                      , new Controller('/logoff', new Logoff(new ApiConnector(Logger), Logger), 'POST')
                       ]);
    app.start();

}


if (Cluster.isMaster) {
    var Logger = new LoggerWrapper('MASTER', logFolder)
    //CommonMethods.initLogger(Logger,'MASTER');
    initConfig(Logger);
    if (config.get('GENERAL', 'client_mode') === 'SINGLE') {
        isSingleMode = true;
    }
    if (isSingleMode === true) {
        init('SINGLE', Logger);
    }
    else {
        var cpuCounter = require('os').cpus().length;
        Logger.info('Starting application in ', cpuCounter, ' processes');
        for (var i = 0; i < cpuCounter; i++) {
            Cluster.fork();
        }
    }
}
else {
    init(process.pid);
}