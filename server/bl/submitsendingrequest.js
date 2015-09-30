var FakeDb = require('../../unittests/fakedb.js');
var SessionManager = require('./sessionmanager.js');
var SubmitSendingRequest = function (db, notifier,sessionManager,logger) {
    var _self = this;
    var dbService = db;
    var Notifier = notifier;
    var Logger = logger;
     
    
    var request = null;
    var response = null;
    var requestCounter = 0;
     _self.SessionManager = sessionManager;
    function SubmitBegin(request,response) {
        var resultMessage = { success: false, description: 'unknown', data: null };
        var sendingRequest = request.GetPostParam('request');
        Logger.debug('New request ',sendingRequest);
        _self.SessionManager.CreateSession(sendingRequest, function (session) {
            _self.SessionManager.AddSession(session);
            Logger.debug('New session sending to client ...',session);
            response.send({ success: true, data: session.Id });
        });
    }

    return function (req, res) {
        SubmitBegin(req, res);
    }
}

module.exports = SubmitSendingRequest;