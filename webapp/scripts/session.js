var Session = function(request){
    var _self = this;
    _self.Id = 1;
    _self.Packages = [];
    _self.PickupAddress = undefined;
    _self.DeliveryAddress = undefined;
    _self.InsuranseValue = 0;
    if (request !== undefined) {
        _self.Id = request.Id;
        var packages = request.SendingRequest.request.Packages;
        _self.PickupAddress = {City:request.SendingRequest.request.PickupCity.Name
                               ,StreetName:request.SendingRequest.request.PickupStreet.Name
                               ,House:request.SendingRequest.request.PickupHouse.Number
                               ,Floor:request.SendingRequest.request.PickupHouse.Floor
                               ,Appartment:request.SendingRequest.request.PickupHouse.Appartment};
        _self.PickupRemark = request.SendingRequest.request.PickupRemark;
        _self.PickupDate = request.SendingRequest.request.PickupDate;
        _self.PickupStartTime = request.SendingRequest.request.PickupStartTime;
        _self.PickupEndTime = request.SendingRequest.request.PickupEndTime;
        _self.PickupContactPerson = request.SendingRequest.request.PickupContactPerson;
        _self.PickupCompany = request.SendingRequest.request.PickupCompany;
        _self.PickupPhone = request.SendingRequest.request.PickupPhone;
        _self.PickupEmail = request.SendingRequest.request.PickupEmail;
        _self.DeliveryContactPerson = request.SendingRequest.request.DeliveryContactPerson;
        _self.DeliveryCompany = request.SendingRequest.request.DeliveryCompany;
        _self.DeliveryAddress = {City:request.SendingRequest.request.DeliveryCity.Name
                               ,StreetName:request.SendingRequest.request.DeliveryStreet.Name
                               ,House:request.SendingRequest.request.DeliveryHouse.Number
                               ,Floor:request.SendingRequest.request.DeliveryHouse.Floor
                               ,Appartment:request.SendingRequest.request.DeliveryHouse.Appartment};
        _self.DeliveryRemark = request.SendingRequest.request.DeliveryRemark;
        _self.DeliveryDate = request.SendingRequest.request.DeliveryDate;
        _self.DeliveryStartTime = request.SendingRequest.request.DeliveryStartTime;
        _self.DeliveryEndTime = request.SendingRequest.request.DeliveryEndTime;
        _self.DeliveryPhone = request.SendingRequest.request.DeliveryPhone;
        _self.DeliveryEmail = request.SendingRequest.request.DeliveryEmail;
        _self.Constraints = request.SendingRequest.request.constraints;
        _self.InsuranseValue = request.SendingRequest.request.InsuranseValue;
        for(var pc =0; pc < packages.length;pc++){
            var pac = new Package();
            pac.Height = packages[pc].Height;
            pac.Width = packages[pc].Width;
            pac.TypeId = packages[pc].Type.id;
            pac.Name = packages[pc].Type.name;
            pac.Weight = packages[pc].Weight;
            pac.Length = packages[pc].Length;
            pac.InsuranseValue = packages[pc].InsuranseValue;
            pac.FreezeNeeded = packages[pc].FreezeNeeded;
            pac.IsolationNeeded = packages[pc].IsolationNeeded;
            pac.Fragile = packages[pc].Fragile;
            pac.Amount = packages[pc].Amount;
            _self.Packages.push(pac);
        }
    }
}