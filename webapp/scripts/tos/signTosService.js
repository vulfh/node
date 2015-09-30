signTosService = function(http){
    var $http= http;
    var self =this;
    self.sendSignature = function(resultCallback){
          $http.post(BASE_URL+'tos',{Method:'SIGN'})
            .success(function(data,status,headers,config){
                resultCallback(data.success)})
            .error(function(data,status,headers,config){
                resultCallback(false);
                });
    }
}
app.service('signTos',['$http',function($http){
        var svc = new signTosService($http);
        return svc;
    }]);