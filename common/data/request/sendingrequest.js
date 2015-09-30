var SendingRequest = function () {
    var _self = this;
    ///PickUp Data
    this.PickupDate = new Date();
    this.PickupStartTime = undefined;
    this.PickupEndTime = undefined;
    this.PickupCity = { Id: undefined, Name: undefined };
    this.PickupHouse = { Number: undefined, Floor: undefined, Appartment: undefined };
    this.PickupStreet = {Id:undefined,Name:undefined};
    this.PickupRemark = undefined;
    ///Delivery Data
    this.DeliveryDate = new Date();
    this.DeliveryStartTime = undefined;
    this.DeliveryEndTime = undefined;
    this.DeliveryCity = { Id: undefined, Name: undefined };
    this.DeliveryStreet = {Id:undefined,Name:undefined};
    this.DeliveryHouse = { Number: undefined, Floor: undefined, Appartment: undefined };

    this.DeliveryRemark = undefined;
    
    this.Packages = [];
    this.OwnerUserId = undefined;
    this.InsuranseValue = undefined;

}
module.exports = SendingRequest;