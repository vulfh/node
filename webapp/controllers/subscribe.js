var Utils = require('util');
var fs = require('fs');
var CommonMethods = require('../../common/commonmethods.js');
var LoggerFacade = require('../../common/logger/facade.js');
var ControllerHandler = require('../../common/controllerhandler.js');
var PageCompiler = require('../../common/template.js');
var Subscribe = function(db,apiConnector,config,logger){
    var _self = this;
    var Logger = new LoggerFacade(logger,'SUBSCRIBE');
    var ApiConnector = apiConnector;
    var DbSvc = db;
    var ConfigSvc = config;
    var builder = new PageCompiler.CompilerBuilder().createBuilder();
    var _pageCompiler = builder.create(logger)
                               .disableSqlInjection()
                               .get();
    function BuildQuery(request){
        var query = {};
        query.Method = request.GetPostParam('Method');
        if (CommonMethods.isNull(query.Method)===true) {
            query.Method = request.GetQueryParam('Method');
        }
        query.UserName = request.GetPostParam('UserName');
        query.Email =request.GetPostParam('Email');
        query.FirstName = request.GetPostParam('FirstName');
        query.LastName = request.GetPostParam('LastName');
        query.Password = request.GetPostParam('Password');
        query.IsSender = true;//request.GetPostParam('IsSender');
        query.IsProvider = request.GetPostParam('IsProvider');
        query.Phone1 = request.GetPostParam('Phone1');
        query.Phone2 = request.GetPostParam('Phone2');
        query.UserId = request.GetQueryParam('UserId');
        
        return query;
    }
    function onApproveUser(data,req,res){
        if (data.data.result === true) {
            req.Session.add('userContext', data.data.data);
            res.writeHead(302, { 'Location': ConfigSvc.get('URL', 'login') });
            res.end();
        }
        else{
            fs.readFile('./pages/templates/ApproveFailure.html','utf8',
                                                   function(err,template){
                                                        if (err) {
                                                            Logger.error('Failed to load tamplate of successful approve page!',err);
                                                            End(res,data);
                                                        }
                                                        else{
                                                            var page = _pageCompiler.CompileQuery(template,{
                                                                Url:ConfigSvc.get('URL','login')
                                                                });
                                                            End(res,page);
                                                        }
                                                    } );
                                           
        }
    }
    function parseServerResponse(data,req,res) {
        if (data.data.method === 'APPROVE-USER') {
                onApproveUser(data,req,res);    
             }
        else{
                End(res,data);
        }
                                                
    }
    function Begin(req,res){
            var request = req;
            var query = BuildQuery(request);
            Logger.debug('Arrived request',query);
            ApiConnector.ProcessSubscribeRequest(query,function onError(errDescription){}
                                           ,function (data){
                                                Logger.debug('Subscription response ', data);
                                                parseServerResponse(data,req,res);
                                            });
    }
    function End(response,data) {
         response.send(data);
    }
    
    
     return function(req,res){
        return Begin(req,res);
    }
}
Utils.inherits(Subscribe,ControllerHandler);
module.exports = Subscribe;