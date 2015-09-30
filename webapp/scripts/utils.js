var utils={};
utils.createDealDetails = function(info){
    var dealDetails = {dealId:info.Id
    ,pickupAddress:info.Request.request.PickupCity.Name+
    ' רח\' '+info.Request.request.PickupStreet.Name+
    ' '+info.Request.request.PickupHouse.Number+
    (utils.isNull(info.Request.request.PickupHouse.Floor)===false)
    ?(' קומה:'+info.Request.request.PickupHouse.Floor):''
    +
    (utils.isNull(info.Request.request.PickupHouse.Appartment)===false)
    ?(' דירה/משרד:'+info.Request.request.PickupHouse.Appartment):''
    ,deliveryAddress:info.Request.request.DeliveryCity.Name+
    ' רח\' '+info.Request.request.DeliveryStreet.Name+
    ' '+info.Request.request.DeliveryHouse.Number+
     (utils.isNull(info.Request.request.DeliveryHouse.Floor)===false)
    ?(' קומה:'+info.Request.request.DeliveryHouse.Floor):''
    +
    (utils.isNull(info.Request.request.PickupHouse.Appartment)===false)
    ?(' דירה/משרד:'+info.Request.request.PickupHouse.Appartment):''
    ,packages: info.Request.request.Packages
    ,pickupDate:  info.Request.request.PickupDate
    ,deliveryDate:info.Request.request.DeliveryDate
    ,pickupStartTime: info.Request.request.PickupStartTime
    ,pickupEndTime : info.Request.request.PickupEndTime
    ,deliveryStartTime: info.Request.request.DeliveryStartTime
    ,deliveryEndTime: info.Request.request.DeliveryEndTime
    ,providerRemark:info.Price.Remark
    ,pickupPhone:info.Request.request.PickupPhone
    ,deliveryPhone:info.Request.request.DeliveryPhone
    ,pickupEmail:info.Request.request.PickupEmail
    ,deliveryEmail:info.Request.request.DeliveryEmail
    ,pickupContactPerson:info.Request.request.PickupContactPerson
    , deliveryContactPerson: info.Request.request.DeliveryContactPerson
    ,constraints:info.Request.request.constraints
    };
    
    return dealDetails;
}

utils.setupDatePicker = function(id,dateFormat,localization){
    $('#'+id).datepicker({
                            dateFormat:dateFormat
                            ,onSelect:function(datetext){
                            }
                        });
    /*if (localization !== undefined && localization !== null) {
        $('#'+id).datepicker('option', $.datepicker.regional[ localization ]);
    }*/
    
}
utils.setupTimePicker = function(id,minTime){
    $('input[id='+id+']').timepicker({'step':'15','timeFormat':'H:i','minTime':minTime,'useSelect':'yes'});
}
utils.clone = function (obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}
utils.isNull = function(obj){
    if (obj === undefined || obj === null) {
        return true;
    }
    else{
        return false;
    }
}
utils.isNullOrEmpty = function (str) {
    var isNull = utils.isNull(str);
    if (isNull === true) {
        return true;
    }
    else {
        if (str.trim() === '') {
            return true;
        }
    }
    return false;
}
utils.compare=function deepCompare () {
  var i, l, leftChain, rightChain;

  function compare2Objects (x, y) {
    var p;

    // remember that NaN === NaN returns false
    // and isNaN(undefined) returns true
    if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
         return true;
    }

    // Compare primitives and functions.     
    // Check if both arguments link to the same object.
    // Especially useful on step when comparing prototypes
    if (x === y) {
        return true;
    }

    // Works in case when functions are created in constructor.
    // Comparing dates is a common scenario. Another built-ins?
    // We can even handle functions passed across iframes
    if ((typeof x === 'function' && typeof y === 'function') ||
       (x instanceof Date && y instanceof Date) ||
       (x instanceof RegExp && y instanceof RegExp) ||
       (x instanceof String && y instanceof String) ||
       (x instanceof Number && y instanceof Number)) {
        return x.toString() === y.toString();
    }

    // At last checking prototypes as good a we can
    if (!(x instanceof Object && y instanceof Object)) {
        return false;
    }

    if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
        return false;
    }

    if (x.constructor !== y.constructor) {
        return false;
    }

    if (x.prototype !== y.prototype) {
        return false;
    }

    // Check for infinitive linking loops
    if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
         return false;
    }

    // Quick checking of one object beeing a subset of another.
    // todo: cache the structure of arguments[0] for performance
    for (p in y) {
        if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
            return false;
        }
        else if (typeof y[p] !== typeof x[p]) {
            return false;
        }
        
    }

    for (p in x) {
        if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
            return false;
        }
        else if (typeof y[p] !== typeof x[p]) {
            return false;
        }

        switch (typeof (x[p])) {
            case 'object':
                 leftChain.push(x);
                 rightChain.push(y);
                 var testResult = utils.compare(y[p],x[p]);
                 if (testResult !== true) {
                    return false;
                 }
                break;
            case 'function':

                leftChain.push(x);
                rightChain.push(y);

                if (!compare2Objects (x[p], y[p])) {
                    return false;
                }

                leftChain.pop();
                rightChain.pop();
                break;

            default:
                if (x[p] !== y[p]) {
                    return false;
                }
                break;
        }
    }

    return true;
  }

  if (arguments.length < 1) {
    return true; //Die silently? Don't know how to handle such case, please help...
    // throw "Need two or more arguments to compare";
  }

  for (i = 1, l = arguments.length; i < l; i++) {

      leftChain = []; //Todo: this can be cached
      rightChain = [];

      if (!compare2Objects(arguments[0], arguments[i])) {
          return false;
      }
  }

  return true;
}

utils.ngApply = function(scope,fn){
      (scope.$$phase || scope.$root.$$phase) ? fn() : scope.$apply(fn);
}

utils.validateNumericInput = function(owner,property){
    utils.validateByRegEx(owner,property,"^[0-9]*[.]*[0-9]*$");
  }
utils.validateIntegerInput = function(owner,property){
    utils.validateByRegEx(owner,property,"^[1-9]+\\d*$");
}
utils.validatePhoneInput = function(owner,property){
    utils.validateByRegEx(owner,property,"^[\\d*\\-{0,1}]*\\d*$");
}
utils.validateByRegEx = function(owner,property,regex){
    var prevPropertyName = property+'$prev';
    pattern = new RegExp(regex);
    
    
    if (pattern.test(owner[property])===false) {
      if (utils.isNull(owner[prevPropertyName])) {
        owner[property] = '';  
      }
      else{
        owner[property] = owner[prevPropertyName];
      }
    }
    owner[prevPropertyName] = owner[property];
}
utils.validateEmail = function(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}
utils.getClosestQurterOfHour = function(min){
    if (min<15) {
        return 15;
    }
    else if (min<30) {
        return 30;
    }
    else if (min<45) {
        return 45;
    }
    return 0;
}