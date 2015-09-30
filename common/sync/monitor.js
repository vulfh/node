var Events = require('events').EventEmitter;
var Utils = require('util');
var Monitor = function () {
    var _self = this;
    _self.Monitors = {};
    this.Lock = function (name, lockedFunction) {
        if (_self.IsLocked(name) === false) {
            _self.emit('lock', name,lockedFunction);
        }
        else {
            setTimeout(function () { _self.Lock(name, lockedFunction) }, 100);
        }
    }
    this.Down = function(name,lockedFunction){
        if (_self.IsLocked(name) === false) {
            _self.emit('down', name,lockedFunction);
        }
        else {
            setTimeout(function () { _self.Lock(name, lockedFunction) }, 100);
        }
    }
    this.Release = function (name) {
        if (_self.Monitors[name] !== undefined) {
            _self.Monitors[name] = false;
        }
    }
    _self.IsLocked = function (name) {
        if (_self.Monitors[name] !== undefined) {
            return _self.Monitors[name];
        }
        else {
            return false;
        }
    }

    //////////////EVENTS///////////////////////////////////
    _self.on('lock', function (name, lockedFunction) {
        _self.Monitors[name] = true;
        if (lockedFunction !== undefined && lockedFunction !== null) {
            lockedFunction(name);
            _self.Release(name);
        }
    });
    
    _self.on('down',function(name,lockedFunction){
            _self.Monitors[name] = true;
            if (lockedFunction !== undefined && lockedFunction !== null) {
                lockedFunction(name);
            }
        });
}
Utils.inherits(Monitor, Events);
module.exports = Monitor;