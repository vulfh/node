var Logger = require('./loggerwrapper.js');
var CommonMethods = require('../commonmethods.js');
var Facade = function(logger,moduleName){
    var _self = this;
    var _moduleName = moduleName;
    var _logger= logger;
    function makeParamArray(args){
        var params = [];
        if (CommonMethods.isNull(_moduleName)=== false) {
            params.push('['+_moduleName+']');    
        }
        
        if (CommonMethods.isNull(args)!==true) {
            for(var pc =0;pc<args.length;pc++){
                params.push(args[pc]);
            }
        }
        return params;
    }
    _self.debug = function(args){
        _logger.debug.apply(_logger,makeParamArray(arguments));
    }
    _self.error = function(args){
        _logger.error.apply(_logger,makeParamArray(arguments));
    }
    _self.info = function(args){
        _logger.info.apply(_logger,makeParamArray(arguments));
    }
    _self.warn = function(args){
        _logger.warn.apply(_logger,makeParamArray(arguments));
    }
}
module.exports = Facade;