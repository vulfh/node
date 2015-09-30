var HttpProxy = require('../common/httpproxy.js');
var ApiConnector = function (logger) {
    this.HOST = 'localhost';
    this.PORT = 3002;
    var Logger = logger;

    this.Authenticate = function (userData, errCallback, callback) {
        HttpProxy.Post(this.HOST, this.PORT, '/authenticate',
                                    { userName: userData.userName, password: userData.password }
                                    , function onError(errDescription) {
                                        if (errCallback !== undefined)
                                            errCallback(errDescription);
                                    }
                                    , function onResponse(data) {
                                        if (callback !== undefined)
                                            callback(data);

                                    }
            );
    }
    this.GetUpdates = function (userId,msgId,action, errCallback, callback) {
        try {
            HttpProxy.Post(this.HOST, this.PORT, '/getupdates'
                                            , { userId: userId,msg_cnt:msgId,action:action}
                                            , function onError(errDescription) {
                                                Logger.error(errDescription);
                                            }
                                            , function onResponse(data) {
                                                if (callback !== undefined && callback !== null) {
                                                    callback(data);
                                                }
                                            });
        } catch(e) {
            Logger.error('Error on GetUpdates '+e.toString);
            if (errCallback!== undefined && errCallback !== null) {
                
                errCallback(e.toString());
            }
        }
    }
    this.SubmitSendingRequest = function (request, errCallback, callback) {
        try{
            HttpProxy.Post(this.HOST, this.PORT, '/submitrequest',
                                        { request: request }
                                        , function onError(errDescription) {
                                            if (errCallback !== undefined)
                                                errCallback(errDescription);
                                        }
                                        , function onResponse(data) {
                                            if (callback !== undefined)
                                                callback(data);
    
                                        }
                );
        }
        catch(e){
             Logger.error('Error on SubmitSendingRequest '+e.toString);
            if (errCallback!== undefined && errCallback !== null) {
                
                errCallback(e.toString());
            }
        }
    }
    this.SendPrice = function(sessionId,userId,price,remark,errCallback,callback){
        HttpProxy.Post(this.HOST,this.PORT,'/provideprice',
                        {price:{sessionId:sessionId,userId:userId,price:price,remark:remark}},
                        function onError(errDescription){
                             if (errCallback !== undefined)
                                            errCallback(errDescription);
                        }
                        ,function onResponse(data){
                             if (callback !== undefined)
                                            callback(data);
                        });
    }
    this.SubmitDeal = function(userId,sessionId,priceId,errCallback,callback){
        HttpProxy.Post(this.HOST,this.PORT,'/deal',
                       {deal:{ownerUserId:userId,sessionId:sessionId,priceId:priceId}},
                       function onError(errDescription){
                       if (errCallback !== undefined)
                                            errCallback(errDescription);
                        }
                        ,function onResponse(data){
                             if (callback !== undefined)
                                            callback(data);
                        }
                       )
    }
    this.Logoff = function(userId,errCallback,callback){
        HttpProxy.Post(this.HOST,this.PORT,'/logoff',{userId:userId},
                       function onError(errDescription){
                         if (errCallback!== undefined && errCallback !== null) {
                            errCallback(errDescription);
                         }
                       },
                       function onResponse(data){
                         if (callback!== undefined && callback !== null) {
                            callback(data);
                         }
                        });
    }
    this.GetArchive = function(query,errCallback,callback){
            HttpProxy.Post(this.HOST,this.PORT,'/archive',{userId:query.userId
                                                           ,method:query.method
                                                           ,startDate:query.startDate
                                                           ,endDate:query.endDate
                                                           ,pageId:query.pageId
                                                           ,pageSize:query.pageSize
                                                           ,dealId:query.dealId
                                                           ,deliveryStatusOriginId:query.deliveryStatusOriginId}
                                                           ,function onError(errDescription){
                                                                if (errCallback!== undefined && errCallback !== null) {
                                                                    errCallback(errDescription);
                                                                 }
                                                                
                                                           }
                                                           ,function onResponse(data){
                                                                if (callback!== undefined && callback !== null) {
                                                                    callback(data);
                                                                 }
                                                            });
    }
    this.ProcessArchiveRequest = function(query,errCallback,callback){
        switch(query.method){
            case 'update':
               this.Update(query,errCallback,callback);
                break;
            default:
                 this.GetArchive(query,errCallback,callback);
                break;
        }
    }
    this.Update = function(query,errCallback,callback){
            HttpProxy.Post(this.HOST,this.PORT,'/archive',{userId:query.userId
                                                           ,method:query.method
                                                           ,deliveryStatusId:query.deliveryStatusId
                                                           ,dealId:query.dealId
                                                           }
                                                           ,function onError(errDescription){
                                                                if (errCallback!== undefined && errCallback !== null) {
                                                                    errCallback(errDescription);
                                                                 }
                                                                
                                                           }
                                                           ,function onResponse(data){
                                                                if (callback!== undefined && callback !== null) {
                                                                    callback(data);
                                                                 }
                                                            });
    }
    this.SaveInterest = function(interestInfo,errCallback,callback){
        HttpProxy.Post(this.HOST,this.PORT,'/interest',{method:interestInfo.Method
                                                       ,data:interestInfo}
                                                       ,function onError(errDescription){
                                                            if (errCallback !== undefined && errCallback !== null) {
                                                                errCallback(errDescription);
                                                            }
                                                        }
                                                        ,function onResponse(data){
                                                                callback(data);
                                                            });
    }
    this.GetInterest = function(query,errCallback,callback){
        HttpProxy.Post(this.HOST,this.PORT,'/interest?userId='+query.UserId
                                                       +'&pageSize='+query.PageSize
                                                       +'&pageId='+query.PageId
                                                      ,{method:query.Method} 
                                                      ,function onError(errDescription){
                                                            if (errCallback !== undefined && errCallback !== null) {
                                                                errCallback(errDescription);
                                                            }
                                                        }
                                                        ,function onResponse(data){
                                                                callback(data);
                                                            }
                                                       );
    }
    this.DeleteInterest = function(query,errCallback,callback){
        
        HttpProxy.Post(this.HOST,this.PORT,'/interest',{method:query.Method
                                                       ,data:{InterestId:query.InterestId}}
                                                        ,function onError(errDescription){
                                                            if (errCallback !== undefined && errCallback !== null) {
                                                                errCallback(errDescription);
                                                            }
                                                        }
                                                        ,function onResponse(){
                                                                callback({success:true});
                                                            });
    }
    this.GetInterestDetails = function(query,errCallback,callback){
         HttpProxy.Post(this.HOST,this.PORT,'/interest?interestId='+query.InterestId
                                                      ,{method:query.Method} 
                                                      ,function onError(errDescription){
                                                            if (errCallback !== undefined && errCallback !== null) {
                                                                errCallback(errDescription);
                                                            }
                                                        }
                                                        ,function onResponse(data){
                                                                callback(data);
                                                            }
                                                       );
    }
    
    this.ProcessInterestRequest = function(query,errCallback,callback){
        switch (query.Method) {
            case 'SAVE':
                this.SaveInterest(query,errCallback,callback);
                break;
            case 'MASTER':
                this.GetInterest(query,errCallback,callback);
                break;
            case 'DETAILS':
                this.GetInterestDetails(query,errCallback,callback);
                break;
            case 'DELETE':
                this.DeleteInterest(query,errCallback,callback);
                break;
        }
    }
    this.IsUserNameUnique = function(query,errCallback,callback){
        HttpProxy.Post(this.HOST,this.PORT,'/subscribe'
                                            ,{method:query.Method,userName:query.UserName}
                                            ,function onError(errDescription){
                                                if (errCallback !== undefined && errCallback !== null) {
                                                                errCallback(errDescription);
                                                            }
                                            }
                                            ,function onResponse(data){
                                                if (typeof callback==='function') {
                                                    callback(data);
                                                }
                                            }
                                            )
    }
    this.IsEmailUnique = function(query,errCallback,callback){
        HttpProxy.Post(this.HOST,this.PORT,'/subscribe'
                                            ,{method:query.Method,email:query.Email}
                                            ,function onError(errDescription){
                                                if (errCallback !== undefined && errCallback !== null) {
                                                                errCallback(errDescription);
                                                            }
                                            }
                                            ,function onResponse(data){
                                                if (typeof callback==='function') {
                                                    callback(data);
                                                }
                                            }
                                            )
    }
    this.SaveUser = function(query,errCallback,callback){
        HttpProxy.Post(this.HOST,this.PORT,'/subscribe'
                                            ,{method:query.Method,
                                              email:query.Email,
                                              userName:query.UserName,
                                              firstName:query.FirstName,
                                              lastName:query.LastName,
                                              password:query.Password,
                                              isSender:query.IsSender,
                                              isProvider:query.IsProvider,
                                              phone1:query.Phone1,
                                              phone2:query.Phone2}
                                            ,function onError(errDescription){
                                                if (errCallback !== undefined && errCallback !== null) {
                                                                errCallback(errDescription);
                                                            }
                                            }
                                            ,function onResponse(data){
                                                if (typeof callback==='function') {
                                                    callback(data);
                                                }
                                            }
                                            )
    }
    this.ApproveUser = function(query,errCallback,callback){
        HttpProxy.Post(this.HOST,this.PORT,'/subscribe'
                                            ,{method:query.Method,
                                              userId:query.UserId}
                                            ,function onError(errDescription){
                                                if (errCallback !== undefined && errCallback !== null) {
                                                                errCallback(errDescription);
                                                            }
                                            }
                                            ,function onResponse(data){
                                                if (typeof callback==='function') {
                                                    callback(data);
                                                }
                                            }
                                            )
    }
    this.ProcessSubscribeRequest = function(query,errCallback,callback){
        switch (query.Method) {
            case 'CHECK-USER-NAME':
                this.IsUserNameUnique(query,errCallback,callback);
                break;
            case 'CHECK-EMAIL':
                this.IsEmailUnique(query,errCallback,callback);
                break;
            case 'SAVE-USER':
                this.SaveUser(query,errCallback,callback);
                break;
            case 'APPROVE-USER':
                this.ApproveUser(query,errCallback,callback);
                break;
        }
    }
    this.tosSign= function(query,errCallback,callback){
        HttpProxy.Post(this.HOST,this.PORT,'/tos'
                                            ,{method:query.Method,
                                              userId:query.UserId}
                                            ,function onError(errDescription){
                                                if (errCallback !== undefined && errCallback !== null) {
                                                                errCallback(errDescription);
                                                            }
                                            }
                                            ,function onResponse(data){
                                                if (typeof callback==='function') {
                                                    callback(data);
                                                }
                                            }
                                            )
    }
    this.ProcessTOSRequest = function(query,errCallback,callback){
        switch (query.Method) {
            case 'SIGN':
                this.tosSign(query,errCallback,callback);
                break;
            
        }
    }
}
module.exports = ApiConnector;  