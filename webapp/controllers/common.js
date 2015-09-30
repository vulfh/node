var Utils = require('util');
var ControllerHandler = require('../../common/controllerhandler.js');
var CommonMethods = require('../../common/commonmethods.js');
var Monitor = require('../../common/sync/monitor.js');
var TemplateCompiler = require('../../common/template.js');
var fs = require('fs');

var Common = function(db,apiConnector,config,logger){
     var _self = this;
     var Logger = logger;
     var ApiConnector = apiConnector;
     var DbSvc = db;
     var _config = config;
     
     var responseSync = new Monitor();
     
     function Begin(request,response) {
        var type = request.GetQueryParam('type');
        Logger.debug('Begin process COMMON request of type ',type,'[',response.id,']');
        ProcessType(type,request,response);
     }
     
     function ProcessType(type,request,response){
    
        var responseData = undefined;
      response.type = type;
        switch (type) {
            case 'get_cities':
                DbSvc.GetCities(function(data){
                    End(data,response);
                    });
               break;
          case 'get_streets':
               var cityId = request.GetQueryParam('cityId');
               DbSvc.GetStreetsOfCity(cityId,function(data){
                    End(data,response);
                    });
               break;
          case 'get_package_types':
               var parentPackageTypeId = request.GetQueryParam('parentPackageTypeId');
               DbSvc.GetPackageTypes(parentPackageTypeId,function(data){
                         End(data,response);
                    });
               break;
          case 'get_regions':
               DbSvc.GetRegions(function(data){
                    End(data,response);
                    });
               break;
          case 'get_origins':
               DbSvc.GetOrigins(function onError(err){
                                   End(data,response);
                         },
                                function onResult(data){
                                        End(data,response);
                                   });
               break;
          case 'get_constants':
               var builder = new TemplateCompiler.CompilerBuilder().createBuilder();
               var compiler = builder.create(Logger)
                               .disableSqlInjection()
                               .get();
               fs.readFile('./scripts/globals.js','utf8',function(err,data){
                    if (err) {
                        Logger.error('Failed to load globals script template: ',err);
                        End('',response);
                    }
                    else{
                         var script = data;
                         var base_url = _config.get('URL','base');
                         var debug = _config.get('GENERAL','debug');
                         script = compiler.CompileQuery(script,{url:base_url,debug:debug});
                         End(script,response);    
                        }
            });
               break;

            case 'get_credit_card_types':
                DbSvc.GetCreditCardTypes(function onError(err) { },
                                         function onResult(data) {
                                             End(data, response);
                                         });
                break;
            case 'get_constraints':
                var constraintOwner = request.GetPostParam('constraintOwner');
                var packageTypeId = request.GetPostParam('packageTypeId');
                if(CommonMethods.isNull(constraintOwner)){

                    DbSvc.GetAllConstraints(function (err) {

                                            },
                                            function(data){
                                                End(data, response);
                                            });
                }
                break;
        }
     }
    function End(data,response){
        Logger.debug('Writing to response:', response.id,' of type ',response.type);
        Logger.debug('Sending common response of ',response.type,'[',response.id,']:',data);
        response.send(data);
     } 
     return function(req,res){
          var request=req;
          var response = res;
          Begin(request,response);
     }
}
Utils.inherits(Common,ControllerHandler);
module.exports = Common;