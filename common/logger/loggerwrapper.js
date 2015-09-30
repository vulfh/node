var Logger = require('./logger.js');
var CommonMethods = require('../commonmethods.js');
var LoggerWrapper = function(pid,folder){
    var _self = this;
    var _pid =pid;
    CommonMethods.initLogger(Logger,_pid,folder);
    function makeParamArray(args){
        var params = [];
        params.push('['+_pid+']');
        if (CommonMethods.isNull(args)!==true) {
            for(var pc =0;pc<args.length;pc++){
                params.push(args[pc]);
            }
        }
        return params;
    }
    _self.debug = function(args){
        Logger.debug.apply(Logger,makeParamArray(arguments));
    }
    _self.error = function(args){
        Logger.error.apply(Logger,makeParamArray(arguments));
    }
    _self.info = function(args){
        Logger.info.apply(Logger,makeParamArray(arguments));
    }
    _self.warn = function(args){
        Logger.warn.apply(Logger,makeParamArray(arguments));
    }
}
module.exports = LoggerWrapper;