var express = require('express');
var Controller = require('../common/controller.js');
var Login = require('./controllers/login.js');
var FakeDB = require('../unittests/fakedb.js');
var ApiConnector = require('../server/apiconnector.js');

delete require.cache[require.resolve('../common/ExpressHost.js')];
var expressHost = require('../common/ExpressHost.js');

var app = new expressHost(3001);
if (app === undefined)
    console.log('oops');
else
    console.log('WEB APP started...');

app.addFolder('./webapp/scripts');
app.addFolder('./webapp/pages');
app.addFolder('./webapp');
app.addFolder('./webapp/controls');
app.addFolder('./webapp/images');
app.addFolder('./webapp/styles/bootstrap/css');
app.addFolder('./webapp/styles/bootstrap/fonts');
app.addFolder('./webapp/styles/bootstrap/js');
app.setControllers([new Controller('/auth', new Login(new FakeDB(),new ApiConnector()), 'POST')]);
app.start();

