var Events = require('events').EventEmitter;
var Utils = require('util');
var Notifier = function (db) {
    this.userList = {};
    this.dbService = db;
    this.NotifySendRequest = function (sendRequest) {
        dbService.GetProviders(function (providers) {
            if (providers !== undefined) {
                for (var pc = 0; pc < providers.length; pc++) {
                    if (this.userList[providers[pc]] === undefined) {
                        this.userList[providers[pc]] = [];
                    }
                    this.userList[providers[pc]].push(sendRequest);
                }
            }
        });
    }
}
Utils.inherits(Notifier, Events);
module.exports = Notifier;