var FakeLogger = function(){
  this.info = function(){};
  this.debug = function(){};
  this.error= function(){};
  this.warn = function(){};
}
module.exports=FakeLogger;