var ControllerHandler = function (db) {
    var _self = this;
    var request = null;
    var response = null;
    
    _self.SetNoCache = function(){
        if (response !== null) {
            response.addHeader("Cache-Control", "post-check=0, pre-check=0");
            res.setHeader("Pragma", "no-cache");
            res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
        }
    }
   

}
module.exports = ControllerHandler;