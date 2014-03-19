var User = require('../common/user/user.js');
var Item = require('../webapp/menu/item.js');
var UserPermission = require('../common/user/userpermission.js');
var FakeDb = function () {
    this.Menu = { "0": new Item('להרשם כשליח', '', "0", [new UserPermission(UserPermission.Sender, true)]),
        "1": new Item('לתת הצעת מחיר כשליח', './pages/GivePrice.html', "1", [new UserPermission(UserPermission.Provider, false)]),
        "2": new Item('להגדיר תחומי עניין כספק', './pages/DefineInterest.html', "2", [new UserPermission(UserPermission.Provider, false)]),
        "3": new Item('לבקש הצעת מחיר לשלוח', './pages/AskForSending.html', "3", [new UserPermission(UserPermission.Sender, false)]),
        "4": new Item('משלוחים שלי', '', "4", [new UserPermission(UserPermission.Sender, false),
                                                      new UserPermission(UserPermission.Provider, false)]),
        "5": new Item('חשבון שלי', '', "5", [new UserPermission(UserPermission.Sender, false),
                                                    new UserPermission(UserPermission.Provider, false)])
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
                resultHandler(null, user);
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

module.exports = FakeDb;
