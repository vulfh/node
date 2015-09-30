var CommonMethods = require('./commonmethods.js');
var Moment = require('moment');
var Template = {};
Template.CompilerBuilder = function(){
    var _self= this;
    
    _self.createBuilder = function(){
        
        return {
                create:function(logger) {
                                    this.$instance  = new Template.Compiler(logger);
                                    return this;
                                },
                 disableSqlInjection:function(){
                                    this.$instance.compileConfig.sqlInjectionDisable.enabled=false;
                                    return this;
                                },
                    get:function() {
                                    return this.$instance;
                                }
            };
    }
   
    return _self;
}
Template.Compiler = function(logger){
    var _self= this;
    var Logger = logger;
    function buildRegex(expr) {
        return new RegExp(expr,'g');
    }
    _self.compileConfig = {
        sqlInjectionDisable:{
            enabled:true,
            method:function(value){
                    var re = /'/g;
                    var stringValue = null;
                    if (CommonMethods.isNull(value)===false) {
                        stringValue = value.toString();
                        var firstChar = stringValue.charAt(0);
                        var lastChar = stringValue.charAt(stringValue.length-1);
                        
                        if (lastChar === firstChar && firstChar ==="'") {
                            stringValue = stringValue.substring(1,stringValue.length-1);
                        }
                        var testValue = stringValue.replace(re,'');
                        stringValue =  stringValue.replace(re,"''");
                        if (lastChar === firstChar && firstChar ==="'"){
                            stringValue = "'"+stringValue+"'";
                        }
                    }
                    else{
                        stringValue = value;
                    }
                    return stringValue;
                }
        }
    }
    var ValidateValue = function(value){
        for(var key in _self.compileConfig){
            if (_self.compileConfig.hasOwnProperty(key)) {
                if (_self.compileConfig[key].enabled===true) {
                  value=  _self.compileConfig[key].method(value);
                }
            }
        }
        return value;
    }
    var GetProperty = function(properties,params,currentIndex){
        if (properties.length === currentIndex) {
            return params;
        }
        else{
            return GetProperty(properties,params[properties[currentIndex]],currentIndex+1);
        }
    }
    var GetValue = function(params,property,valuePath){
        if (valuePath!== undefined && valuePath !== null) {
            if (valuePath[property]== undefined || valuePath[property]===null) {
                 return params[property];
            }
            else{
                var properties = valuePath[property].split('.');
                
                return GetProperty(properties,params,0);
            }
        }
        else{
            return params[property];
        }
    }
    var GetFullPropertyName = function(propertyName,valuePath){
        
        if (valuePath!== undefined && valuePath !== null) {
            if (valuePath[propertyName] !== undefined && valuePath[propertyName]!== null) {
                return valuePath[propertyName];
            }
            else{
               return propertyName;
            }
        }
        else{
            return propertyName;
        }
    }
    
       
    var CompileProperty = function(propertyName,evals,value){
       if (evals!== undefined && evals !== null) {
                if (evals[propertyName]!== undefined && evals[propertyName]!== null) {
                    Logger.debug(value,' will be evaluted by ',evals[propertyName]);
                    var find = '{' + propertyName + '}';
                    var re = new RegExp(find,'g');
                    var expression = evals[propertyName].replace(re,value);
                    Logger.debug('Expression to evaluate :',expression);
                    value = eval(expression);
                    Logger.debug('Evaluation result: ',value);
                }
            }
        if (value === undefined || value === null){
            value = 'NULL';
        }
        return value;
    }
    _self.CompileQuery = function (query, params,evals,valuePath) {
        var compiledQuery = query;
        if (CommonMethods.isNull(params)!==true) {
                Object.keys(params).forEach(function (p, idx) {
                if (params[p] instanceof Object) {
                    Object.keys(params[p]).forEach(function(prop,index){
                            var propertyName = p+'.'+prop;
                            var value = CompileProperty(propertyName,evals,params[p][prop]);
                            if (CommonMethods.isNull(value)===false) {
                                value = ValidateValue(value);
                            }
                            var expr = buildRegex('{' + propertyName + '}');
                            compiledQuery = compiledQuery.replace(expr,value);
                             if (value === 'NULL') {
                               compiledQuery = compiledQuery.replace(expr, value);
                             }
                        });
                }
                else{
                    var value = GetValue(params,p,valuePath);
                    var propertyName = p;
                    if (CommonMethods.isNull(value)===false) {
                        value = ValidateValue(value);
                    }var expr = buildRegex('{' + propertyName + '}');
                    value = CompileProperty(propertyName,evals,value);
                    compiledQuery = compiledQuery.replace(expr, value);
                    if (value === 'NULL') {
                        compiledQuery = compiledQuery.replace(expr, value);
                    }
                }
            }); 
        }
        
        Logger.debug("Compiled query to execute:",compiledQuery);
        return compiledQuery;
    }
}
module.exports = Template;