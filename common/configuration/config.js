var Configuration = require('../../config.js');
var CommonMethods = require('../commonmethods.js');
var Config = function(logger,environment){
    var _self = this;
    var _logger = logger;
    var _environment = environment;
    _logger.info('ENVIRONMENT:',_environment);
    var _currentConfiguration = Configuration[_environment];
    if (CommonMethods.isNull(_currentConfiguration)===true) {
        _logger.error('Configuration for environment ',_environment,' was not found !');
    }
    
    _self.get = function(section,key){
        return _currentConfiguration[section][key];
    }
}
module.exports = Config;