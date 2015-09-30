var MkDirp = require('mkdirp');
var Crypto = require('crypto');
var CommonMethods = function(){
   
    
     if (typeof String.prototype.startsWith != 'function') {
  // see below for better implementation!
            String.prototype.startsWith = function (str){
              return this.indexOf(str) == 0;
            };
    }
}
CommonMethods.isNull  = function(obj){
            if (typeof(obj) !== 'undefined' && obj !== null) {
                return false;
            }
            else{
                return true;
            }
    }
CommonMethods.initLogger = function(logger,loggerName,folder){
    logger.StartConsoleLogging('debug');
    var logDir = folder+'/logs_'+loggerName;
    MkDirp(logDir);
    logger.StartFileLogging('debug',logDir+'/log.log');
}

CommonMethods.encryptAes256Ctr = function(data,password){
    var cipher = Crypto.createCipher( 'aes-256-ctr',password)
    var crypted = cipher.update(data.toString(),'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}
CommonMethods.decryptAes256Ctr=function (data,password){
  var decipher = Crypto.createDecipher( 'aes-256-ctr',password)
  var dec = decipher.update(data,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}
 CommonMethods.guid = function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}
CommonMethods.evaluateNull = function(value){
     return (CommonMethods.isNull(value)===true)?'':value;
}

module.exports = CommonMethods;