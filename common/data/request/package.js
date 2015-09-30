var Package = function () {
    var _self = this;
    this.Length = undefined;
    this.Width = undefined;
    this.Height = undefined;
    this.Weight = undefined;
    this.Name = undefined;
    this.InsuranseValue = undefined;
    this.IsolationNeeded = false;
    this.FreezeNeeded = false;
    this.InsuranceNeeded = false;
    this.Fragile = false;
    this.PackageType = _self.Envelope;
}
Package.Envelpope = {id:0,name:'מעטפה'};
Package.Package = {id:1,name:'חבילה'};
Package.Platform = {id:2,name:'משטח'};
Package.IdentifyPackageType=function (typeId) {
        var type = null;
        switch (typeId) {
            case 0:
                type = Package.Envelpope;
                break;
            case 1:
                type = Package.Package;
                break;
            case 2:
                type = Package.Platform;
                break;
        }
        return type;
    }

module.exports = Package;