var User = require('./user/user.js');
var Item = require('./menu/item.js');
var UserPermission = require('./user/userpermission.js');
var FakeDb = function () {
    this.Menu = {"0": new Item('להרשם כשליח','',"0",[new UserPermission(UserPermission.Sender,true)]),
                 "1": new Item('לתת הצעת מחיר כשליח','./pages/GivePrice.html',"1",[new UserPermission(UserPermission.Provider,false)]),
                 "2": new Item('להגדיר תחומי עניין כספק','./pages/DefineInterest.html',"2",[new UserPermission(UserPermission.Provider,false)]),
                 "3": new Item('לבקש הצעת מחיר לשלוח','./pages/AskForSending.html',"3",[new UserPermission(UserPermission.Sender,false)]),
                 "4": new Item('משלוחים שלי','',"4",[new UserPermission(UserPermission.Sender,false),
                                                      new UserPermission(UserPermission.Provider,false)]),
                 "5": new Item('חשבון שלי','',"5",[new UserPermission(UserPermission.Sender,false),
                                                    new UserPermission(UserPermission.Provider,false)])};
}
FakeDb.prototype.Login = function (user, resultHandler) {
    if (user.userName === 'provider1' && user.password === '1234') {
        user.id = 26877;
        user.AddPermission(new UserPermission(UserPermission.Provider));
        if (resultHandler != null) {
            resultHandler(null, user);
        }
    } else if (user.userName === 'sender1' && user.password === '1234') {
        user.id = 25214;
        user.AddPermission(new UserPermission(UserPermission.Sender));
        if (resultHandler != null) {
            resultHandler(null, user);
        }
    }
    else {
        resultHandler({ message: 'user not authenticated!' }, null);
    }
}

FakeDb.prototype.GetMenu = function (errorHnadler,  resultHandler) {
    resultHandler(this.Menu);

}
module.exports = FakeDb;
