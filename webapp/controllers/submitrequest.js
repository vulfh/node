var Utils = require('util');
var ControllerHandler = require('../../common/controllerhandler.js');
var Package = require('../../common/data/request/package.js');
var SendingRequest = require('../../common/data/request/sendingrequest.js');
var CommonMethods = require('../../common/commonmethods.js');
var Moment = require('moment');
var LoggerFacade = require('../../common/logger/facade.js');

var SubmitRequest = function (db, apiConnector,logger) {

    var user = undefined;
    var sendingRequest = undefined;
    var resultMessage = null;
    var ApiConnector = apiConnector;
    var Logger = new LoggerFacade(logger,'SUBMIT-REQUEST');
    
    function GetRequestConstraints(req) {
        var constraints = [];
        if (CommonMethods.isNull(req.constraints) === false) {
            if (CommonMethods.isNull(req.constraints['courier']) === false) {
                req.constraints['courier'].every(function (value, idx) {
                    if (value.selected === true) {
                        constraints.push(value.id);
                    }
                    return true;
                });
            }
            if (CommonMethods.isNull(req.constraints['sender']) === false) {
                req.constraints['sender'].every(function (value, idx) {
                    if (value.selected === true) {
                        constraints.push(value.id);
                    }
                    return true;
                });
            }
            if (CommonMethods.isNull(req.constraints['receiver']) === false) {
                req.constraints['receiver'].every(function (value, idx) {
                    if (value.selected === true) {
                        constraints.push(value.id);
                    }
                    return true;
                });
            }
        }
        return constraints;
    }
    function SubmitBegin(request,response) {
        Logger.debug('response will be sent to RESPONSE #', response.id);
        Moment.lang('he');
        request.Session.get('userContext', function (user) {
            if (user !== undefined && user !== null) {
                sendingRequest = request.GetPostParam('request');
                Logger.debug('Arrived request from the client ', sendingRequest);
                apiSendingRequest = new SendingRequest();
                apiSendingRequest.constraints = GetRequestConstraints(sendingRequest);
                if (sendingRequest !== null && sendingRequest !== undefined) {
                    var packages = [];
                    for (var pc = 0; pc < sendingRequest.packageCounter; pc++) {
                        var packageDef = new Package();
                        packageDef.Length = sendingRequest.packageDefinitions[pc].SubPackageType.Length;
                        packageDef.Width = sendingRequest.packageDefinitions[pc].SubPackageType.Width;
                        packageDef.Height = sendingRequest.packageDefinitions[pc].SubPackageType.Height;
                        packageDef.Weight = sendingRequest.packageDefinitions[pc].SubPackageType.Weight;
                        packageDef.InsuranseValue = sendingRequest.packageDefinitions[pc].SubPackageType.InsuranseValue;
                        packageDef.Type = Package.IdentifyPackageType(sendingRequest.packageDefinitions[pc].SubPackageType.TypeId);
                        packageDef.Amount = sendingRequest.packageDefinitions[pc].Amount;
                        if (sendingRequest.packageDefinitions[pc].SubPackageType.FreezeNeeded !== undefined) {
                            packageDef.FreezeNeeded = sendingRequest.packageDefinitions[pc].SubPackageType.FreezeNeeded;
                        }
                        if (sendingRequest.packageDefinitions[pc].SubPackageType.Fragile !== undefined) {
                            packageDef.Fragile = sendingRequest.packageDefinitions[pc].SubPackageType.Fragile;
                        }
                        if (sendingRequest.packageDefinitions[pc].SubPackageType.IsolationNeeded !== undefined) {
                            packageDef.IsolationNeeded = sendingRequest.packageDefinitions[pc].SubPackageType.IsolationNeeded;
                        }
                        if (sendingRequest.packageDefinitions[pc].SubPackageType.InsuranseNeeded !== undefined) {
                            packageDef.InsuranseNeeded = sendingRequest.packageDefinitions[pc].SubPackageType.InsuranseNeeded;
                        }
                        apiSendingRequest.Packages.push(packageDef);
                    }
                    apiSendingRequest.PickupDate = Moment(sendingRequest.pickupDate, 'dddd, DD MMMM, YYYY').format('YYYY-MM-DD');
                    apiSendingRequest.PickupStartTime = sendingRequest.pickupStartTime;
                    apiSendingRequest.PickupEndTime = sendingRequest.pickupEndTime;
                    apiSendingRequest.PickupCity = { Name: sendingRequest.pickupCity.name, Id: sendingRequest.pickupCity.Id };
                    apiSendingRequest.PickupStreet = sendingRequest.PickupStreet;
                    apiSendingRequest.PickupHouse.Number = sendingRequest.pickupHouse;
                    apiSendingRequest.PickupHouse.Floor = sendingRequest.pickupFloor;
                    apiSendingRequest.PickupHouse.Appartment = sendingRequest.pickupAppartment;
                    apiSendingRequest.PickupRemark = sendingRequest.pickupRemark;
                    apiSendingRequest.PickupContactPerson = sendingRequest.pickupContactPerson;
                    apiSendingRequest.PickupCompany = sendingRequest.pickupCompany;
                    apiSendingRequest.PickupPhone = sendingRequest.pickupPhone;
                    apiSendingRequest.PickupEmail = sendingRequest.pickupEmail;

                    apiSendingRequest.DeliveryDate = Moment(sendingRequest.deliveryDate, 'dddd, DD MMMM, YYYY').format('YYYY-MM-DD');
                    apiSendingRequest.DeliveryStartTime = sendingRequest.deliveryStartTime;
                    apiSendingRequest.DeliveryEndTime = sendingRequest.deliveryEndTime;
                    apiSendingRequest.DeliveryCity = { Name: sendingRequest.deliveryCity.name, Id: sendingRequest.deliveryCity.Id };
                    apiSendingRequest.DeliveryStreet = sendingRequest.DeliveryStreet;
                    apiSendingRequest.DeliveryHouse.Number = sendingRequest.deliveryHouse;
                    apiSendingRequest.DeliveryHouse.Floor = sendingRequest.deliveryFloor;
                    apiSendingRequest.DeliveryHouse.Appartment = sendingRequest.deliveryAppartment;
                    apiSendingRequest.DeliveryRemark = sendingRequest.deliveryRemark;
                    apiSendingRequest.DeliveryContactPerson = sendingRequest.deliveryContactPerson;
                    apiSendingRequest.DeliveryCompany = sendingRequest.deliveryCompany;
                    apiSendingRequest.DeliveryPhone = sendingRequest.deliveryPhone;
                    apiSendingRequest.DeliveryEmail = sendingRequest.deliveryEmail;
                    apiSendingRequest.OwnerUserId = user.id;
                    apiSendingRequest.InsuranseValue = sendingRequest.insuranseValue;
                    Logger.debug('Sending the following request:', apiSendingRequest);
                    ApiConnector.SubmitSendingRequest({ request: apiSendingRequest }, function onError(error) {
                        Logger.error('SUBMITREQUEST api connector error:', error);
                    },
                                                    function (data) {
                                                        Logger.debug('SUBMITREQUEST api response :', data);
                                                        SubmitEnd(data, response);
                                                    });

                }
            }
        });
        
        
    }
    function SubmitEnd(session,response) {
        Logger.debug('Sending new session to client ',session);
       response.send({ success: true, data: session });
       Logger.debug('Sending response  to RESPONSE #',response.id);
    }

    return function (req, res) {
        var request = req;
        var response = res;
        SubmitBegin(request,response);
    }
}

Utils.inherits(SubmitRequest, ControllerHandler);
module.exports = SubmitRequest;