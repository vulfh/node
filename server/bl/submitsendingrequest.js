var FakeDb = require('../../unittests/fakedb.js');
var SubmitSendingRequest = function (db) {
    var dbService = db;
    var resultMessage = { success: false, description: 'unknown', data: null };
    var request = null;
    var response = null;
    var requestCounter = 0;
    function SubmitBegin(req, res) {
        debugger;
        request = req;
        response = res;
        var rfs = request.GetPostParam('request');
        rfs.id = ++requestCounter;
        req.Cache.AddItem('sr' + rfs.id, rfs);
        res.send('ok');
    }

    return function (req, res) {
        SubmitBegin(req, res);
    }
}

module.exports = SubmitSendingRequest;