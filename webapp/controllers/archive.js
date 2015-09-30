var Utils = require('util');
var Moment = require('moment');
var ControllerHandler = require('../../common/controllerhandler.js');

var Archive = function(db,apiConnector,logger){
    var _self = this;
    var Logger = logger;
    var ApiConnector = apiConnector;
    var DbSvc = db;
    
    Moment.lang('he');
    
    function ValidateQuery(query) {
        if (query.startDate !== undefined && query.startDate !== null ) {
            query.startDate = Moment(unescape(query.startDate),'llll').format('YYYY-MM-DD');
        }
        if (query.endDate !== undefined && query.endDate !== null) {
            query.endDate = Moment(unescape(query.endDate),'llll').format('YYYY-MM-DD');
        }
        return query;
    }
    function Begin(request,response){
        var user = request.Session.get('userContext', function (user) {
            if (user !== undefined && user !== null) {
                var query = {};
                query.userId = user.id;
                query.method = request.GetQueryParam('method');
                query.startDate = request.GetQueryParam('startDate');
                query.endDate = request.GetQueryParam('endDate');
                query.pageId = request.GetQueryParam('pageId');
                query.pageSize = request.GetQueryParam('pageSize');
                query.dealId = request.GetQueryParam('dealId');
                query.deliveryStatusId = request.GetQueryParam('deliveryStatusId');
                query.deliveryStatusOriginId = parseInt(request.GetQueryParam('deliveryStatusOriginId'));
                query = ValidateQuery(query);
                Logger.debug('Got archive query :', query);
                ApiConnector.ProcessArchiveRequest(query
                                        , function onError(errDescription) {
                                            End(response, { success: false, description: errDescription });
                                        }
                                        , function onResponse(data) {
                                            if (data !== undefined && data !== null) {
                                                End(response, data);
                                            }
                                            else {
                                                End(response, { success: false, description: 'internal error' });
                                            }
                                        });
            }
            else {
                Logger.error('Archive: user not found !');
            }

        });
       
    }
    function End(response,data){
        Logger.debug('Archive: Sending response to client:',data);
        response.send(data);
    }
    return function(req,res){
        return Begin(req,res);
    }
}

Utils.inherits(Archive,ControllerHandler);
module.exports = Archive;