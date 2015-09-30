Package = function () {
    //this.self = this;
    this.Length = undefined;
    this.Width = undefined;
    this.Height = undefined;
    this.Weight = undefined;
    this.Name = undefined;
    this.TypeId = undefined;
    this.InsuranseNeeded = false;
    this.InsuranseValue = 0;
    this.FreezeNeeded = false;
    this.Fragile = false;
    this.IsolationNeeded = false;
    this.SubPackages = [];
}
Package.DATE_FORMAT='dddd, Do MMMM, YYYY';


Envelope = function () {
    // this.self = this;
    //  this.BasePackage = new Package();
    Package.call(this);
    this.Name = "מעטפה";
    this.TypeId = 0;
    this.Length = 10;
    this.Width = 7;
    this.Height = 0;
    this.Weight = 0.2;
    this.SubPackages.push(new SmallEnvelope(), new MediumEnvelope());
}

Envelope.prototype = new Package();

SmallEnvelope = function () {
    //this.self = this;
    Package.call(this);
    this.Name = "מעטפה קטנה";
    this.Length = 10;
    this.Width = 7;
    this.Height = 0;
    this.Weight = 0.2;
    this.TypeId = 0;
}
SmallEnvelope.prototype = new Package();

MediumEnvelope = function () {
    //this.self = this;
    Package.call(this);
    this.Name = "מעטפה בינונת";
    this.Length = 15;
    this.Width = 10;
    this.Height = 0;
    this.Weight = 0.5;
    this.TypeId = 0;
}
MediumEnvelope.prototype = new Package();
///////////REGULAR PACKAGES

RegularPackage = function () {
    //this.self = this;
    //this.BasePackage = new Package();
    Package.call(this);
    this.Name = "חבילה";
    this.Length = 15;
    this.Width = 10;
    this.Height = 5;
    this.Weight = 0.5;
    this.TypeId = 1;
    this.SubPackages = [new SmallPackage(), new MediumPackage(), new LargePackage()];

}
RegularPackage.prototype = new Package();


SmallPackage = function () {
    //this.self = this;
    Package.call(this);
    this.Name = "חבילה קטנה";
    this.Length = 17;
    this.Width = 24;
    this.Height = 10;
    this.Weight = 1;
    this.TypeId = 1;

}
SmallPackage.prototype = new Package();
MediumPackage = function () {
    //this.self = this;
    Package.call(this);
    this.Name = "חבילה בינונת";
    this.Length = 25;
    this.Width = 35;
    this.Height = 17;
    this.Weight = 2;
    this.TypeId = 1;
}

MediumPackage.prototype = new Package();

LargePackage = function () {
    //this.self = this;
    Package.call(this);
    this.Name = "חבילה גדולה";
    this.Length = 25;
    this.Width = 49;
    this.Height = 19;
    this.Weight = 3;
    this.TypeId = 1;
}
LargePackage.prototype = new Package();

////////////PLATFORM//////////////////////
Platform = function (inLoop) {
    //this.self = this;
    Package.call(this);

    this.Name = "משטח";
    
    this.Weight = 100;
    this.TypeId = 2;
    if (inLoop === undefined || inLoop === false)
        this.SubPackages = [new RegularPlatform(), new SafePlatform()];
}
Platform.prototype = new Package();

SafePlatform = function () {
  ///     this.self = this;
       Platform.call(this, true);
       this.Length = 155;
       this.Width = 195;
       this.Height = 175;
       this.Name = "משטח מבוטח";
      this.InsuranseNeeded = true;
     
}
SafePlatform.prototype = new Platform(true);
RegularPlatform = function () {

    //    this.self = this;
    Platform.call(this, true);
    this.Length = 150;
    this.Width = 200;
    this.Height = 170;
    this.Name = "משטח רגיל";
    this.TypeId = 2;
}
RegularPlatform.prototype = new Platform(true);


////////////////////////////////
PackageDefinition = function (name,counter) {
    //this.self = this;
    this.Index = 0;
    this.Counter = counter;
    this.Packages = [new Envelope(), new RegularPackage(),new Platform()];
    this.PackageType = this.Packages[0];
    this.SubPackages = this.PackageType.SubPackages;
    this.SubPackageType = this.PackageType.SubPackages[0];
    this.Name = name;
    this.PlatformDivId = "platform_" + this.Name + this.Counter;
    this.InsuranceDivId = "insuranse_" + this.Name + this.Counter;
    this.Amount = 1;
    this.SetIndex = function (idx) {
        this.Index = idx;
    }
    this.ChangeInsuranseState = function(){
        var div = $('#'+this.InsuranceDivId+' :input');
        if (this.SubPackageType.InsuranseNeeded === true) {
            div.prop('disabled',false);
        }
        else{
           div.prop('disabled',true);
        }
        
    }
    
    this.PackageTypeChange = function () {
        this.SubPackages = this.PackageType.SubPackages;
        this.SubPackageType = this.SubPackages[0];
    }
  
}
//////////////////////REQUEST  FOR SHIPPING
 RequestForShipping = function (rName, rId) {
           
            var relativePickupDate = new Date();
            relativePickupDate.setMinutes(utils.getClosestQurterOfHour(relativePickupDate.getMinutes()));
            if (relativePickupDate.getMinutes()===0) {
                relativePickupDate.setHours(relativePickupDate.getHours()+1);
            }
            var relativeDeliveryDate = utils.clone(relativePickupDate);
            relativeDeliveryDate.setHours(relativeDeliveryDate.getHours()+4);
            if (relativeDeliveryDate.getHours()<relativePickupDate.getHours()
                || relativeDeliveryDate.getHours()+2 >= 24) {
                relativeDeliveryDate.setDate(relativeDeliveryDate.getDate()+1);
            }
           
            this.name = rName;
            this.id = rId;
            this.sessionId = undefined;
            this.packageCounter = 0;
            this.insuranseValue = 0;
            
            this.pickupCity = CITIES[0];
            this.pickupStreet = undefined;
            this.pickupHouse = undefined;
            this.pickupFloor = undefined;
            this.Appartment = undefined;
            this.pickupRemark = undefined;
            this.pickupContactPerson = undefined;
            this.pickupCompany = undefined;
            this.pickupPhone = undefined;
            this.pickupEmail = undefined;
            
            this.deliveryCity = CITIES[0];
            this.deliveryStreet = undefined;
            this.deliveryHouse = undefined;
            this.deliveryFloor = undefined;
            this.deliveryAppartment = undefined;
            this.deliveryRemark = undefined;
            this.deliveryContactPerson = undefined;
            this.deliveryCompany = undefined;
            this.deliveryPhone = undefined;
            this.deliveryEmail = undefined;
            this.currentStage = 1;
            this.constraints = {courier:[],sender:[],receiver:[]};//
            
            this.packageDefinitions = [new PackageDefinition(this.id + "afs", this.packageCounter++)];
            this.packageDefinitions[0].SetIndex(0);
            this.pickupDate = moment((new Date()).toDateString()).format(Package.DATE_FORMAT);
            this.pickupStartTime = moment(relativePickupDate).format('HH:mm');
          //  relativePickupDate = relativePickupDate.setHours(relativePickupDate.getHours()+2);
            this.pickupEndTime = moment(relativePickupDate.setHours(relativePickupDate.getHours()+2)).format('HH:mm');
            this.deliveryDate = moment(relativeDeliveryDate).format(Package.DATE_FORMAT );
            this.deliveryStartTime = moment(relativeDeliveryDate).format('HH:mm');
            relativeDeliveryDate.setHours(relativeDeliveryDate.getHours()+2);
            this.deliveryEndTime = moment(relativeDeliveryDate).format('HH:mm')
            this.calculateInsuranseValue = function(){
                     this.insuranseValue = 0;
                     for(var pdi=0;pdi<this.packageDefinitions.length;pdi++){
                        this.insuranseValue+= this.packageDefinitions[pdi].SubPackageType.InsuranseValue;
                     }
            }
            this.getExistingPackageTypes = function () {
                var types = [];
                for (var pdi = 0; pdi < this.packageDefinitions.length; pdi++) {
                    if (types.indexOf(this.packageDefinitions[pdi].SubPackageType.TypeId) < 0) {
                        types.push(this.packageDefinitions[pdi].SubPackageType.TypeId);
                    }
                }
                return types;

            }
            this.addPackage = function () {
                var pd = new PackageDefinition(this.id + "afs", this.packageCounter++);
                pd.SetIndex(this.packageDefinitions.length);
                this.packageDefinitions.push(pd);
            }
            this.resetConstraints = function () {
                this.constraints = { courier: [], sender: [], receiver: [] };
            }
            this.setConstraints = function (packageTypeId, con) {
                    setOwnerConstraints(this,packageTypeId, 'courier', con);
                    setOwnerConstraints(this,packageTypeId, 'sender', con);
                    setOwnerConstraints(this,packageTypeId, 'receiver', con);
            }
            
         
            function setOwnerConstraints(self,packageTypeId, ownerType, con) {
                    if(utils.isNull(con[ownerType])!==null){
                        con[ownerType].every(function(value,idx){
                            var item = { name: value.name, id: value.id, selected: false };
                            self.constraints[ownerType].push(item);
                            return true;
                        });
                    }
                }
            this.Prices = {};
        }
    
