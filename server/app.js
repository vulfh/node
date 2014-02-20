var express = require('express');
var Controller = require('./controller.js');
var Authentication = require('./authentication.js')
var FakeDB = require('./fakedb.js');
/*var app = express();

app.use(express.static(__dirname + '/scripts'));
app.use(express.static(__dirname+'/pages'));
app.use(express.static(__dirname));
app.use(express.static(__dirname+'/images'));
app.use(express.static(__dirname+'/styles/bootstrap/css'));
app.use(express.static(__dirname+'/styles/bootstrap/fonts'));
app.use(express.static(__dirname+'/styles/bootstrap/js'));

//app.listen(process.env.PORT || 3001);
app.listen(3001);*/
delete require.cache[require.resolve('./ExpressHost.js')];
var expressHost = require('./ExpressHost.js');

var app = new expressHost(3001);
if(app === undefined)
	console.log('oops');
app.addFolder('../scripts');
app.addFolder('../pages');
app.addFolder("../");
app.addFolder('../images');
app.addFolder('../styles/bootstrap/css');
app.addFolder('../styles/bootstrap/fonts');
app.addFolder('../styles/bootstrap/js');

app.setControllers([new Controller('/test', function (req, res) {console.log('q parameter is %s',req.QueryParams.q);res.send('ok'); }, "GET"),
                    new Controller('/auth',new Authentication(new FakeDB()),'POST')], function (err) { });
app.start();

