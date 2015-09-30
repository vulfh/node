var Communication = function ($http,dialogService) {
    var _self = this;
    _self._http = $http;
    var _messageCounter =0 ;
    var HandlersList = { 'new_session': {},
        'new_price': {},
        'new_deal': {},
        'session_update':{}
    };
    var ListnersCounter = 0;
    function AddListenerToEvent(eventName, listenerName, callback) {
        if (HandlersList[eventName] !== undefined) {
            HandlersList[eventName][listenerName] = { Name: listenerName, Callback: callback };
            ListnersCounter++;
        }
    }
    function RemoveListenerToEvent(eventName, listenerName) {
        if (HandlersList[eventName] !== undefined) {
            if (HandlersList[eventName][listenerName] !== undefined) {
                HandlersList[eventName][listenerName] = undefined;
                ListnersCounter--;
            }
        }
    }
    _self.Start = function () {
        ListnersCounter = 0;
        CheckForUpdates();
    }
    _self.Stop = function(){
        ListnersCounter = -1;
        Object.keys(HandlersList).forEach(function(handlerType,idx){
                HandlersList[handlerType] = {};
            });
    }
    function SendAck(ackId,callback){
         _self.SendGetMessage(BASE_URL+'updates/?mc='+(ackId)+'&action=ack&cd='+Math.random(),
                                                                 function(data,status,headers,config){
                                                                    SendAck(ackId,callback);
                                                                    },
                                                                 function (data,status,headers,config) {
                                                                    callback(data,status,headers,config);
                                                                 }
                                                                 
                                                                 );
    }
    function CheckForUpdates() {
       //console.log('BEGIN Get updates #'+_messageCounter+' ...');
        if (ListnersCounter >= 0) {
            _self.SendGetMessage(BASE_URL+'updates/?mc='+(_messageCounter)+'&action=get_new&cd='+Math.random(), function (data, status, headers, config) {
                                            
                                            console.log('ERROR END Get updates #'+_messageCounter+' ...');
                                            _messageCounter++;
                                            setTimeout(CheckForUpdates, 1000);
                                            },
                                          function (data, status, headers, config) {
                                            //console.log('END Get updates #'+_messageCounter+' ...');
                                            
                                            for(ec=0;ec<data.length;ec++){
                                                 var ev = data[ec];
                                                  Fire(ev.EventName,ev.EventType, ev.Target, ev.Content);
                                            }
                                           // console.log('BEGIN ACK #'+_messageCounter+' ...');
                                           SendAck(_messageCounter,function(data,status,headers,config){
                                                                   //  console.log('END OF ACK #'+_messageCounter+' ...');
                                                                     _messageCounter++;
                                                                     setTimeout(CheckForUpdates, 1000);         
                                                                    
                                                                 });
                                                                   
                                          });
            
        }
        else{
            setTimeout(CheckForUpdates, 1000);
        }
    }

    function StopListenToPriceUpdate(sessionId) {
        
    }
    
    
    _self.SendPrice = function(sessionId,price) {
        _self.SendPostMessage(BASE_URL+'provideprice',{sessionId:sessionId,price:price.price,remark:price.remark},function(){}, function(result){
                if (result.success === true) {
                   dialogService.alert('הצעה נשלחה!');
                }
                else{
                    dialogService.alert('הצעה נכשלה!');
                }
            });
    }
    //////EVENT LISTENERS
    _self.ListenToNewSession = function (listenerName, callback) {
        AddListenerToEvent('new_session', listenerName, callback);
    }
    
    _self.ListenToNewQuote = function (listenerName, callback) {
        AddListenerToEvent('new_price', listenerName, callback);
    }
    _self.ListenToSessionUpdate = function(listenerName,callback){
        AddListenerToEvent('session_update',listenerName,callback);
    }
    _self.ListenToNewDeal = function (listenerName, callback) {
        AddListenerToEvent('new_deal', listenerName, callback);
    }
    function Fire(eventName,eventType, listenerName, data) {
        if (eventName == 'session_update') {
    //        debugger;
        }
        if (HandlersList[eventName] !== undefined) {
            if (HandlersList[eventName][listenerName] !== undefined) {
                
                try {
                    /// console.log('EVENT_TYPE:'+eventType);
                     HandlersList[eventName][listenerName].Callback(eventType,data);
                } catch(e) {
                    dialogService.alert('Error:'+eventName+' '+listenerName+' '+e.toString());
                }
            }
        }
    }
    ////////////////////////////////////////////////
    _self.SendPostMessage = function (url, postData, errorHandler, successHandler) {
         try{
            $.post(url,postData, function (data) {
                if (successHandler !== undefined) {
                    successHandler(data);
                }
               
            })
            .fail(errorHandler);
        }
        catch(err){
           if(errorHandler !== undefined){
                errorHandler(err);
           }
        }
    }
    _self.SendGetMessage = function (url, errorHandler, successHandler) {
        try{
      /*      $.getJSON(url, function (data) {
                if (successHandler !== undefined) {
                     successHandler(data);
                }
            })
            .fail(errorHandler);*/
      _self._http({method:'GET',url:url,timeout:50000})
      .success(function(data,status,headers,config){
                    if (successHandler !== undefined) {
                                successHandler(data);
                    }
        })
      .error(function(data,status,headers,config){
       // alert('error');
            if (errorHandler!== undefined && errorHandler !== null) {
                errorHandler(data);
            }
        })
        }
        catch(err){
           if(errorHandler !== undefined){
                errorHandler();
           }
        }
    }

}
