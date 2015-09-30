var Utils = require('util');
var CommonMethods = require('../../common/commonmethods.js');
var Package = require('../../common/data/request/package.js');
var ControllerHandler = require('../../common/controllerhandler.js');
var Interest = function(db,apiConnector,logger){
    var _self = this;
    var Logger = logger;
    var ApiConnector = apiConnector;
    var DbSvc = db;
    
    function Begin(req,res){
        var request = req;
        req.Session.get('userContext', function (user) {
            if (user !== undefined && user !== null) {
                var query = {};
                query.UserId = user.id;
                query.Id = request.GetPostParam('interestId');
                query.Name = request.GetPostParam('interestName');
                query.MaxInsuranceValue = request.GetPostParam('maxInsuranceValue');
                query.HasFreeze = request.GetPostParam('hasFreeze');
                query.HasIsolation = request.GetPostParam('hasIsolation');
                query.Fragile = request.GetPostParam('hasFragile');
                query.Regions = request.GetPostParam('regions');
                query.Packages = request.GetPostParam('packages');
                query.Scheduler = request.GetPostParam('scheduler');
                if (CommonMethods.isNull(query.Packages) === false) {
                    query.Packages.every(function (value, idx) {
                        value.Type = Package.IdentifyPackageType(value.TypeId);
                        return true;
                    });
                }



                query.Method = request.GetPostParam('method');
                query.InterestId = request.GetPostParam('interestId');
                if (CommonMethods.isNull(query.InterestId) === true) {
                    query.InterestId = request.GetQueryParam('interestId');
                }
                if (CommonMethods.isNull(query.Method) === true) {
                    query.Method = request.GetQueryParam('method');
                }
                query.PageSize = request.GetQueryParam('pageSize');
                query.PageId = request.GetQueryParam('pageId');
                Logger.debug('Arrived interest change request with the following query:', query);
                ApiConnector.ProcessInterestRequest(query, function onError(errDescription) { }
                                               , function onResponse(data) {
                                                   Logger.debug('Interest response ', data);
                                                   End(res, data)


                                               });
            }

        });
        
    }
    function End(response,data) {
         response.send(data);
    }
    
    
     return function(req,res){
        return Begin(req,res);
    }
}
Utils.inherits(Interest,ControllerHandler);
module.exports = Interest;