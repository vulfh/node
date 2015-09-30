 subscriptionSvc = function(http,shared){
             var $http = http;
             var $shared = shared;
             var _self = this;
             _self.phonePrefixes= [{id:-1,desc:'בחר קידומת'},
                           {id:1,desc:'03'},
                           {id:2,desc:'04'},
                           {id:3,desc:'08'},
                           {id:4,desc:'09'},
                           {id:5,desc:'072'},
                           {id:6,desc:'073'},
                           {id:7,desc:'074'},
                           {id:8,desc:'076'}];
             _self.mobilePrefixes=[{id:-1,desc:'בחר קידומת'},
                           {id:1,desc:'050'},
                           {id:2,desc:'052'},
                           {id:3,desc:'054'},
                           {id:4,desc:'057'}];
             
             
             
             _self.checkUserName = function(userName,errCallback,resultCallback){
                          $http.post(BASE_URL+'subscribe',{Method:'CHECK-USER-NAME',
                                     UserName:userName})
            .success(function(data,status,headers,config){
                resultCallback(data.data.result)})
            .error(function(data,status,headers,config){});
             }
            
            _self.checkEmail = function(email,errCallback,resultCallback){
              $http.post(BASE_URL+'subscribe',{Method:'CHECK-EMAIL',
                                     Email:email})
            .success(function(data,status,headers,config){
                          resultCallback(data.data.result);
                })
            .error(function(data,status,headers,config){});
            }
            
            _self.saveUser = function(user,errCallback,resultCallback){
             
                          $http.post(BASE_URL+'subscribe',user)
                        .success(function(data,status,headers,config){
                                       
                                        resultCallback({success:data.data.result,description:data.data.description})
                            })
                        .error(function(data,status,headers,config){});
            }
}
app.service('subscriptionSvc', ['$http','shared',function ($http) {
             var svc = new subscriptionSvc($http);
            return svc;
        } ]);