var express = require('express');
var Controller = require('../common/controller.js');
var Authentication = require('./user/authentication.js');
var Authorization = require('./user/authorization.js');
var SubmitSendingRequest = require('./bl/submitsendingrequest.js');

var FakeDB = require('../unittests/fakedb.js');

delete require.cache[require.resolve('../common/ExpressHost.js')];
var expressHost = require('../common/ExpressHost.js');

var app = new expressHost(3002);
if (app === undefined)
    console.log('oops');
else
    console.log('API SERVER started ...');

app.setControllers([new Controller('/authenticate',new Authentication(new FakeDB(),new Authorization()),'POST')
                   ,new Controller('/afs',new SubmitSendingRequest(new FakeDB()),'POST')], function (err) { });
app.start();

