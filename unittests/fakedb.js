var User = require('../common/user/user.js');
var Item = require('../webapp/menu/item.js');
var UserPermission = require('../common/user/userpermission.js');
var FakeDb = function () {
    this.Menu = { "0": new Item('להרשם כשליח', '', "0", [new UserPermission(UserPermission.Regular, false)]),
        "1": new Item('לתת הצעת מחיר כשליח', './pages/GivePrice.html', "1", [new UserPermission(UserPermission.Provider, false)]),
        "2": new Item('להגדיר תחומי עניין כספק', './pages/InterestArea.html', "2", [new UserPermission(UserPermission.Provider, false)]),
        "3": new Item('לבקש הצעת מחיר לשלוח', './pages/AskForSending.html', "3", [new UserPermission(UserPermission.Sender, false)]),
        "4": new Item('משלוחים שלי', './pages/Archive.html', "4", [new UserPermission(UserPermission.Sender, false),
                                                      new UserPermission(UserPermission.Provider, false)]),
        "5": new Item('חשבון שלי', './pages/MyAccount.html', "5", [new UserPermission(UserPermission.Sender, false),
                                                    new UserPermission(UserPermission.Provider, false)]),
        "6":new Item('תנאי שירות','./pages/ViewTOS.html','6',[new UserPermission(UserPermission.Sender, false),
                                                    new UserPermission(UserPermission.Provider, false),
                                                    new UserPermission(UserPermission.Regular, false)])
    };
    this.Users = [{userName:'provider1',id:26877,password:'1234',permissions:[new UserPermission(UserPermission.Provider,false)]}
                 ,{userName:'sender1',id:25214,password:'1234',permissions:[new UserPermission(UserPermission.Sender,true)]}];
}
FakeDb.prototype.Login = function (user, resultHandler) {
    for (var uc = 0; uc < this.Users.length; uc++) {
        if (user.userName === this.Users[uc].userName && user.password === this.Users[uc].password) {
            user.id = this.Users[uc].id;
            for (var pc = 0; pc < this.Users[uc].permissions.length; pc++) {
                user.AddPermission(this.Users[uc].permissions[pc]);
            }
            if (resultHandler != null) {
                resultHandler({message:'Ok',code:0}, user);
                return; ;
            }
        }
    }
    if(resultHandler!== undefined){
          resultHandler({message:"User not found !",code:-1},user);
     }
}

FakeDb.prototype.GetMenu = function (errorHnadler,  resultHandler) {
    resultHandler(this.Menu);
    

}

 FakeDb.SubmitSendingRequest = function (sendingRequest, resultHandler) {
        if (_self.sessionCounter === undefined || _self.sessionCounter === null) {
            _self.sessionCounter = 1;
        }
        else {
            _self.sessionCounter++;
        }
        var session = new Session(10);
        session.SendingRequest = sendingRequest;
        session.Id = _self.sessionCounter;
        if (resultHandler !== undefined && resultHandler !== null) {
            resultHandler(session);
        }


    }
FakeDb.SavePrice = function(providerUserId,sessionId,price,remark,resultHandler){
    
   if (_self.priceCounter === undefined || _self.priceCounter === null) {
            _self.priceCounter = 1;
        }
        else {
            _self.priceCounter++;
        }
        var priceDetails = new Price(_self.priceCounter,providerUserId,sessionId,price,remark);
        if (resultHandler !== undefined && resultHandler !== null) {
           resultHandler(priceDetails);
        }
        
  }
FakeDb.SaveDeal = function(session,price,resultHandler){
     if (_self.dealCounter === undefined || _self.dealCounter === null) {
        _self.dealCounter =1;
     }
     else{
        _self.dealCounter++;
     }
     var dealDetails = new DealDetails();
     dealDetails.Id = _self.dealCounter;
     dealDetails.Request = session.SendingRequest;
     dealDetails.SenderUser = session.OwnerUserId;
     dealDetails.ProviderUser = price.UserId;
     dealDetails.SessionId = session.Id;
     if (resultHandler !== undefined && resultHandler !== null) {
           resultHandler(dealDetails);
        }
     
    
  }
module.exports = FakeDb;
