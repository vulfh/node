 ///AskForSending Controller
angular.module("mockup").controller("askForSendingController", ['$scope', '$http', '$timeout','com', 'shared','dialogService','constraintsSvc',
                                             function ($scope, $http, $timeout,com, shared,dialogService,constraints) {
                                                 
                                               
                                                  
                                               function itnitialRequestWithContactDetails(req){
                                                req.pickupContactPerson = shared.user.name;
                                                req.pickupPhone = shared.user.phone;
                                                req.pickupEmail = shared.user.email;
                                                 req.pickupHouse = shared.user.house;
                                                 req.initialized =false;
                                                 req.pickupAppartment = shared.user.appartment;
                                                if (utils.isNull(shared.user.cityId)=== false) {
                                                    req.pickupCity = shared.getCityById(shared.user.cityId);
                                                      shared.getStreetsOfCity(req.pickupCity.Id,function(streets){
                                                                        utils.ngApply($scope,function(){
                                                                            req.pickUpStreets = streets;
                                                                            req.PickupStreet = shared.getStreetById(streets, shared.user.streetId);
                                                                        });
                                                                       
                                                                        req.initialized =true;
                                                        });
                                                }
                                               
                                                
                                               }
                                                function hideStage(id,stageId) {
                                                    var selector = '#'+id+'_container>div[data-stage="'+stageId+'"]';
                                                    $(selector).hide();
                                                }
                                                function showStage(id,stageId) {
                                                    var selector = '#'+id+'_container>div[data-stage="'+stageId+'"]';
                                                    $(selector).show();
                                                }
                                                function hideAllStages(id) {
                                                    var selector = '#'+id+'_container>div[data-stage]';
                                                    $(selector).hide();
                                                }
                                                function updateDates(req)
                                                {
                                                     req.deliveryDate = $('#afsDeliveryDate_'+req.id).val();
                                                     req.pickupDate =  $('#afsPickupDate_'+req.id).val();
                                                }
                                                function validate(req){
                                                  if (DEBUG === true) {
                                                    return validateDebug(req);
                                                  }
                                                  else{
                                                    return validateRelease(req);
                                                  }
                                                }
                                                function validateDebug(req) {
                                                  
                                                  if (utils.isNull(req.pickupHouse)) {
                                                      req.pickupHouse = 0;
                                                    }
                                                    if (utils.isNull(req.deliveryHouse)) {
                                                      req.deliveryHouse= 0;
                                                    }
                                                    
                                                    if (utils.isNull(req.pickupFloor)) {
                                                      req.pickupFloor = 0;
                                                    }
                                                    
                                                    if (utils.isNull(req.deliveryFloor)) {
                                                      req.deliveryFloor = 0;
                                                    }
                                                    
                                                    if (utils.isNull(req.pickupAppartment)) {
                                                      req.pickupAppartment  = 0;
                                                    }
                                                    
                                                    if (utils.isNull(req.deliveryAppartment)) {
                                                      req.deliveryAppartment = 0;
                                                    }
                                                    if (utils.isNull(req.pickupPhone)) {
                                                     req.pickupPhone='054-1234567';
                                                    }
                                                    if (utils.isNull(req.deliveryPhone)) {
                                                      req.deliveryPhone='052-7654321';
                                                    }
                                                    if (utils.validateEmail(req.pickupEmail)===false) {
                                                      req.pickupEmail='vulfhm@gmail.com';
                                                    }
                                                    if (utils.validateEmail(req.deliveryEmail)===false) {
                                                      req.deliveryEmail = 'vulfh@yahoo.com';
                                                    }
                                                    return true;
                                                }
                                                function validateRelease(req) {
                                                  var message = undefined;
                                                  var pickupDate = $('#afsPickupDate_'+req.id).datepicker('getDate');
                                                  var deliveryDate = $('#afsDeliveryDate_'+req.id).datepicker('getDate');
                                                    if (pickupDate>deliveryDate) {
                                                      message = 'תאריך איסוף מאוחר יותר מתאריך מסירה.';
                                                    }
                                                    else if (req.pickupCity.Id ===-1) {
                                                         message='לא נבחרה עיר איסוף.';
                                                       }
                                                    else if (req.PickupStreet.Id === -1) {
                                                        message = 'לא נבחר רחוב איסוף.';
                                                    }
                                                    else if (utils.isNull(req.pickupHouse)) {
                                                      message = 'מס בית איסוף לא צוין.';
                                                    }
                                                    else if (req.deliveryCity.Id ===-1) {
                                                      message='לא נבחרה עיר מסירה.';
                                                    }
                                                    else if (req.DeliveryStreet.Id === -1) {
                                                      message = 'לא נבחר רחוב מסירה.';
                                                    }
                                                    else if (utils.isNull(req.deliveryHouse)) {
                                                       message = 'מס בית מסירה לא צוין.';
                                                    }
                                                    else if (utils.isNull(req.pickupPhone)) {
                                                      message="מס' טלפון של השולח לא צוין";
                                                    }
                                                    else if (utils.isNull(req.deliveryPhone)) {
                                                      message="מס' טלפון של המקבל המשלוח לא צוין.";
                                                    }
                                                    else if (utils.validateEmail(req.pickupEmail)===false) {
                                                      message = "כתובת דואר אלקטרוני  של השולח אינה תקינה.";
                                                    }
                                                    else if (utils.validateEmail(req.deliveryEmail)===false) {
                                                      message = "כתובת דואר אלקטרוני של המקבל החבילה אינה תקינה.";
                                                    }
                                                   
                                                    
                                                    if (!utils.isNull(message)) {
                                                      dialogService.alert(message);
                                                      return false;
                                                    }
                                                    else{
                                                      return true;
                                                    }
                                                }
                                                function checkPayment(requestId, priceId) {
                                                    shared.checkPayment = true;
                                                    $scope.selectedPriceId = priceId;

                                                    
                                                }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////                                                
                                                $scope.confirmDeal = function (requestId) {
                                                    var priceId = $scope.selectedPriceId;
                                                    var price = $scope.GetPriceById(requestId, priceId);
                                                    $http.post(BASE_URL + 'deal', { price: price })
                                                    .success(function (data, status, headers, config) {
                                                        //  alert('Ok');
                                                    })
                                                    .error(function (data, status, headers, config) {

                                                    });
                                                }
                                                $scope.cancelDeal = function (rid) {
                                                    dialogService.alert('העסקה בוטלה !')
                                                }
                                                $scope.isIntegerInput = function(owner,property){
                                                  utils.validateIntegerInput(owner,property);
                                                }
                                                $scope.showSection = function (value) {
                                                    if (typeof (value) === 'string') {
                                                        if (value !== null && value !== undefined) {
                                                            return true;
                                                        }
                                                        else {
                                                            return false;
                                                        }
                                                    }
                                                    else {
                                                        if (value !== null && value !== undefined && value > -1) {
                                                            return true;
                                                        }
                                                        else {
                                                            return false;
                                                        }
                                                    }
                                                }
                                                $scope.isPhoneInput = function(owner,property){
                                                  utils.validatePhoneInput(owner,property);
                                                }
                                                 $scope.isNumericInput = function(owner,property){
                                                  utils.validateNumericInput(owner,property);
                                                }

                                                 $scope.hideAllTabs = function () {
                                                     for (var i = 0; i < $scope.requests.length; i++) {
                                                         $("#" + $scope.requests[i].id).css("display", "none");
                                                     }
                                                 }
                                                 $scope.showTab = function (reqId) {
                                                     var req = $scope.getRequestById(reqId);
                                                     $("#" + req.id).css("display", "block");
                                                     
                                                    // $scope.changeInsuranseState(req.id);
                                                 }
                                                 $scope.getRequestById = function (reqId) {
                                                     for (var i = 0; i < $scope.requests.length; i++) {
                                                         if ($scope.requests[i].id === reqId) {
                                                             return $scope.requests[i];
                                                         }
                                                     }
                                                     return undefined;
                                                 }
                                                 $scope.getRequestBySessionId = function(sessionId){
                                                    for (var i = 0; i < $scope.requests.length; i++) {
                                                         if ($scope.requests[i].sessionId === sessionId) {
                                                             return $scope.requests[i];
                                                         }
                                                     }
                                                     return undefined;
                                                 }
                                                 $scope.removePackage = function (reqId, index) {

                                                     var req = $scope.getRequestById(reqId);
                                                     req.packageDefinitions.splice(index, 1);
                                                 }
                                                 
                                                 $scope.changeInsuranseState = function(requestId,packageIndex){
                                                    var req = $scope.getRequestById(requestId);
                                                    if (packageIndex !== undefined && packageIndex !== null) {
                                                         req.packageDefinitions[packageIndex].ChangeInsuranseState();
                                                    }
                                                    else{
                                                        for(var pi=0;pi < req.packageDefinitions.length;pi++){
                                                            req.packageDefinitions[pi].ChangeInsuranseState();
                                                        }
                                                    }
                                                   
                                                 }
                                                 $scope.changeInsuranseValue = function(reqId,index){
                                                    var req = $scope.getRequestById(reqId);
                                                    req.calculateInsuranseValue();
                                                   
                                                 }
                                                 
                                                 $scope.OnSessionUpdated = function(eventType,info){
                                                    
                                                    switch(eventType)
                                                    {
                                                        case 'new_price':
                                                            var sessionId = info.SessionId;
                                                            var req = $scope.getRequestBySessionId(sessionId);
                                                            req.Prices[info.UserId]=info;
                                                            break;
                                                        case 'new_deal':
                                                            var dealMessage = 'נסגרה עסקת שליחות עם :';
                                                            dealMessage+= info.ProviderUser.userName;
                                                            shared.showTicket(utils.createDealDetails(info));
                                                            $('#divPrices'+info.SessionId+' :input').prop('disabled',true);
                                                            break;
                                                    }
                                                    
                                                    
                                                    if(!$scope.$$phase) {
                                                        $scope.$apply();
                                                    }
                                                 }
                                                 $scope.sendRequest = function (id) {
                                                     
                                                     var req = $scope.getRequestById(id);
                                                     if(!validate(req))
                                                        return;
                                                     updateDates(req);
                                                     disableSendButton(id);
                                                     
                                                     //$("#" + id + " :input").prop("disabled", true);
                                                     hideStage(id,4);
                                                     $('#divPrices'+id).show();
                                                     $http.post(BASE_URL+'request', { request: req })
                                               
                                                .success(function (data, status, headers, config) {
                                                    var sessionId = data.data.data;
                                                    req.sessionId = sessionId;
                                                    req.name = 'בקשה '+sessionId;
                                                    com.ListenToSessionUpdate(sessionId,$scope.OnSessionUpdated);
                                                    $('#divPrices'+id).attr('id','divPrices'+sessionId);
                                                })
                                                .error(function (data, status, headers, config) {
                                                      //TODO: Proper error handling
                                                        dialogService.alert('error:'+data);
                                                        $('#btnSendRequest'+id).css('visibility', 'visible');
                                                       });
                                                     
                                                 }
                                                $scope.next = function(id){
                                                      var req=$scope.getRequestById(id);
                                                       if(req.currentStage === 2){
                                                        if(!validate(req))
                                                          return;
                                                      }
                                                      if (req.currentStage>1) {
                                                        updateDates(req);
                                                      }
                                                    
                                                      hideStage(id,req.currentStage);
                                                      req.currentStage++;
                                                      showStage(id,req.currentStage);
                                                      if (req.currentStage=== 2) {
                                                        $('#deliveryCities'+req.Id).focus();
                                                      }
                                                      
                                                }
                                                $scope.prev = function(id){
                                                      var req=$scope.getRequestById(id);
                                                     
                                                      hideStage(id,req.currentStage);
                                                      req.currentStage--;
                                                      showStage(id,req.currentStage);
                                                      
                                                }  
                                                 $scope.GetPriceById = function(requestId,priceId){
                                                    var req = $scope.getRequestById(requestId);
                                                    var price = undefined;
                                                    $.each(req.Prices,function(idx,p){
                                                            if (p.Id === priceId) {
                                                             price = p;
                                                            }
                                                        });
                                                    return price;
                                                 }
                                                 $scope.sendAccept = function (requestId, priceId) {
                                                     checkPayment(requestId, priceId);
                                                    
                                                 }
                                                 $scope.addRequest = function () {
                                                     var req = new RequestForShipping("בקשה חדשה " + ($scope.requests.length + 1), "request" + $scope.requests.length);
                                                     itnitialRequestWithContactDetails(req);
                                                     updateRequestConstraints(req);
                                                     $scope.requests.push(req);
                                                     $scope.tabs.unshift(req);
                                                     $scope.updatePickupStreetsList(req);
                                                     $scope.updateDeliveryStreetsList(req);
                                                     this.hideAllTabs();
                                                     this.showTab(req.id);
                                                     
                                                     $scope.switchTab("tab" + req.id, req.id);
                                                     setTimeout(function () { $scope.init() }, 100);
                                                 }
                                                 $scope.setupCalendars = function(reqId){
                                                                            var req=$scope.getRequestById(reqId);
                                                                            utils.setupDatePicker('afsPickupDate_'+reqId,'DD, d MM, yy');
                                                                            utils.setupDatePicker('afsDeliveryDate_'+reqId,'DD, d MM, yy');
                                                                            utils.setupTimePicker('afsPickupStartTime_'+reqId,req.pickupStartTime);
                                                                            utils.setupTimePicker('afsPickupEndTime_'+reqId,req.pickupEndTime);
                                                                            utils.setupTimePicker('afsDeliveryStartTime_'+reqId,req.deliveryStartTime);
                                                                            utils.setupTimePicker('afsDeliveryEndTime_'+reqId,req.deliveryEndTime);
                                                                            hideAllStages(reqId);
                                                                            showStage(reqId,1);
                                                                            showStage(reqId,4);
                                                            }
                                                 $scope.switchTab = function (liId, tabId) {
                                                     window.senderCurrentTabId = tabId;
                                                     $("ul[id='requestsMenu'] > li > a").removeClass("sub-tab-selected");
                                                     $("ul[id='requestsMenu'] > li > a").addClass("sub-tab-unselected");
                                                     var li = $("#" + liId);
                                                     li.removeClass('sub-tab-unselected');
                                                     li.addClass("sub-tab-selected");
                                                     $scope.hideAllTabs();
                                                     $scope.showTab(tabId);
                                                    
                                                    
                                                    
                                                 }
                                                 
                                                 $scope.updatePickupStreetsList = function(request){
                                                      if (request.initialized === true) {
                                                     
                                                      shared.getStreetsOfCity(request.pickupCity.Id,function(streets){
                                                        request.pickUpStreets = streets;
                                                        request.PickupStreet = request.pickUpStreets[0];
                                                       
                                                        });
                                                      }
                                                      
                                                 }
                                                 $scope.updateDeliveryStreetsList = function(request){
                                                     shared.getStreetsOfCity(request.deliveryCity.Id,function(streets){
                                                                request.deliveryStreets = streets;
                                                                request.DeliveryStreet = request.deliveryStreets[0];
                                                            });
                                                 }
                                                 $scope.showSeparator = function(request,pic){
                                                    if(request.packageDefinitions[0].Counter === pic){
                                                      return false;
                                                    }
                                                   else{  
                                                      return true;
                                                   }
                                                 }
                                                 $scope.disableWeightField = function(pac){
                                                  if (pac.PackageType.TypeId=== 0) {
                                                    return true;
                                                  }
                                                  else{
                                                    return false;
                                                  }
                                                  
                                                 }
                                                 $scope.init = function () {
                                                     var tabId;
                                                     if (utils.isNull(window.senderCurrentTabId) === true)
                                                     {
                                                         tabId = $scope.requests[0].id;
                                                     }
                                                     else {
                                                         tabId = window.senderCurrentTabId;
                                                     }
                                                     $scope.switchTab("tab" + tabId, tabId);
                                                     $scope.updatePickupStreetsList($scope.requests[0]);
                                                     $scope.updateDeliveryStreetsList($scope.requests[0]);

                                                 }
                                                 $scope.packageTypeChanged = function (p,rid) {
                                                     p.PackageTypeChange();
                                                     var req = $scope.getRequestById(rid);
                                                     updateRequestConstraints(req);
                                                 }
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                 function disableSendButton(id) {
                                                     if (DEBUG === false) {
                                                         $('#btnSendRequest' + id).css('visibility', 'hidden');
                                                     }
                                                 }
                                                 
                                                 function restoreState() {
                                                     utils.ngApply($scope, function () {
                                                         $scope.requests = window.requests;
                                                         $scope.tabs = window.senderTabs;
                                                         
                                                     });
                                                     setTimeout(function () {
                                                         hideAllStages(window.senderCurrentTabId);
                                                         var req = $scope.getRequestById(window.senderCurrentTabId);
                                                         showStage(req.id, req.currentStage);
                                                         if (req.currentStage !== 3) {
                                                             showStage(req.id, 4);
                                                         }
                                                         else {
                                                             disableSendButton(req.id);
                                                         }
                                                     }, 100);
                                                 }
                                                 function buildInitialRequest() {
                                                     if (utils.isNull(CITIES) === true) {
                                                         setTimeout(function () { buildInitialRequest(); }, 100);
                                                     }
                                                     else {
                                                         $scope.requests = [new RequestForShipping("בקשה חדשה 1", "request0")];

                                                         itnitialRequestWithContactDetails($scope.requests[0]);
                                                         updateRequestConstraints($scope.requests[0]);
                                                         $scope.tabs = [$scope.requests[0]];
                                                         window.senderCurrentTabId = undefined;

                                                         window.requests = $scope.requests;
                                                         window.senderTabs = $scope.tabs;
                                                     }
                                                 }
                                                 function updateRequestConstraints(req) {
                                                     packageTypes = req.getExistingPackageTypes();
                                                     req.resetConstraints();
                                                     packageTypes.every(function (value, idx) {
                                                         constraints.getConstraintsForPackage(value)
                                                         .then(function (packageConst) {
                                                             req.setConstraints(value, packageConst);
                                                         });
                                                     });


                                                 }
                                                 
                                                    
                                                 
                                                 if (utils.isNull(window.requests) === true) {
                                                     buildInitialRequest();
                                                 }
                                                 else {
                                                     restoreState();
                                                 }
                                             } ]);