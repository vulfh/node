var Utils = require('util');
var ControllerHandler = require('../../common/controllerhandler.js');

var Logoff = function(db,apiConnector,logger){
    var _self= this;
    var dbService = db;
    var ApiConnectorService = apiConnector;
    var Logger = logger;
    
    function Begin(request,response){
        request.Session.get('userContext', function (user) {
            if (user !== undefined && user !== null) {
                Logger.info('Logging of user ' + user);
                apiConnector.Logoff(user.id, function (errDescription) { },
                                    function (data) { End(data, request, response) });
            }
            else {
                End(undefined, request, response);
            }
        });
       
    }
    function End(data,request,response){
        if (data!==undefined) {
            request.Session.close();
        }
        response.send({success:true,userId:data.userId});
    }
    
    return function(req,res){
        var request = req;
        var response = res;
        Begin(request,response);
        
    }
}
Utils.inherits(Logoff,ControllerHandler);
module.exports = Logoff;