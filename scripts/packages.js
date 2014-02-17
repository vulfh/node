Package = function(){
    //this.self = this;
    this.Length = undefined;
    this.Width = undefined;
    this.Height = undefined;
    this.Weight = undefined;
    this.Name = undefined;

    this.SubPackages = [];
}


Envelope = function () {
   // this.self = this;
    //  this.BasePackage = new Package();
    Package.call(this);
    this.Name = "מעטפה";
    this.SubPackages.push(new SmallEnvelope(),new MediumEnvelope());
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
    this.Height = 0;
    this.Weight = 0.5;
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

}
LargePackage.prototype = new Package();

////////////PLATFORM//////////////////////
Platform = function (inLoop) {
    this.self = this;
    Package.call(this);

    this.Name = "משטח";
    this.FreezeNeeded = false;
    this.Fragile = false;
    this.IsolationNeeded = false;
    this.InsuranseNeeded = false;
    this.Weight = 100;
    if(inLoop === undefined || inLoop === false)
        this.SubPackages = [new RegularPlatform(),new SafePlatform()];
}
Platform.prototype = new Package();

SafePlatform = function () {
       this.self = this;
       Platform.call(this, true);
       this.Length = 155;
       this.Width = 195;
       this.Height = 175;
       this.Name = "משטח מבוטח";
      this.InsuranseNeeded = true;
     
}
SafePlatform.prototype = new Platform(true);
RegularPlatform = function () {
   
    this.self = this;
    Platform.call(this, true);
    this.Length = 150;
    this.Width = 200;
    this.Height = 170;
    this.Name = "משטח רגיל";

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
    this.SetIndex = function (idx) {
        this.Index = idx;
    }
    this.PackageTypeChange = function () {
        this.SubPackages = this.PackageType.SubPackages;
        this.SubPackageType = this.SubPackages[0];
        if (this.PackageType instanceof Platform) {
            $("#" + this.PlatformDivId).css("display", "block");
        }
        else {
            $("#" + this.PlatformDivId).css("display", "none");

        }
    }
}
    
