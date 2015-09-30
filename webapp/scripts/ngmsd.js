
//////SERVICES/////////////////////////////////////////////////
        
        
        
        var sharedUI = function(com,shared,dialog,$compile,$scope){
            
            var _self = this;
            this.Sessions = [];
            this.com = com;
            this.shared = shared;
            
            this.AddSession = function(session){
                var uiSession = new Session(session);
                 _self.Sessions.unshift(uiSession);
                 _self.com.ListenToSessionUpdate(session.Id,_self.OnSessionUpdated);
                 //alert("התקבלה בקשת שליחות חדשה. מס."+session.Id);
                  //dialog.alert();
                  var alertHtml ="התקבלה בקשת שליחות חדשה. מס."+session.Id+"<request-details request='request' id='not-"+session.Id+"'></request-details>";
                  dialog.alert(alertHtml);
                  var scope =$scope.$new();
                  scope.request = uiSession;
                  var interpolateFn = $compile($('#not-'+session.Id),scope);
                  var html = interpolateFn(scope);
                  
            }
            this.OnSessionUpdated = function(eventType,info){
                 switch (eventType) {
                    case 'new_deal':
                        var dealMessage = 'נסגרה עסקת שליחות עם:';
                        dealMessage += info.SenderUser.userName;
                        //alert(dealMessage);
                        _self.shared.showTicket(utils.createDealDetails(info));
                        break;
                    case 'price_reject':
                        dialog.alert(info.Reason);
                        var s = _self.GetSessionById(info.SessionId);
                         $("#sessionDefinition" + s.Id+' :input').attr('disabled',true);
                        break;
                }
            }
            this.GetSessionById = function(sessionId){
                for(var i= 0;i<_self.Sessions.length;i++){
                    if (_self.Sessions[i].Id === sessionId) {
                        return _self.Sessions[i];
                    }
                }
                 return undefined;
            }
        }
        
       
        
      

        app.factory('com', ['$http','dialogService', function ($http,dialogService) {
            var com = new Communication($http,dialogService);
            return com;
        } ]);
        app.factory('sharedUI',['com','shared','dialogService','$compile','$rootScope',function(com,shared,dialogService,$compile,$scope){
                return new sharedUI(com,shared,dialogService,$compile,$scope);
            }]);
        ///////DIRECTIVES///////////////////////////////////////////////
        app.directive('onRepeatFinishedDirective', function ($timeout) {
            return function (scope, element, attrs) {
                if (scope.$last) {
                    var callBack = 'scope.' + attrs.onRepeatFinishedDirective;
                    $timeout(function () {
                        eval(callBack);
                    });
                }
            };
        })
         angular.module("mockup").directive('dateFix', function () {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function (scope, element, attr, ngModel) {
                    element.on('change', function () {
                        scope.$apply(function () {
                            ngModel.$setViewValue(element.val());
                        });
                    });
                }
            };
        });