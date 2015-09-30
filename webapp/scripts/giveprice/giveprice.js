app.controller('sessions',['$scope','shared','com','sharedUI','constraintsSvc',function($scope,shared,com,sharedUI,cs){
            $scope.LastId = 1;
            
            $scope.Sessions = sharedUI.Sessions;
            $scope.currentTabId = undefined;
             
             $scope.cleanSessionsOnLogoff = function(){
                $scope.Sessions = [];
             }
             $scope.hideAllTabs = function () {
                                                     for (var i = 0; i < $scope.Sessions.length; i++) {
                                                         $("#sessionDefinition" + $scope.Sessions[i].Id).css("display", "none");
                                                     }
                                        }
            $scope.showSection = function(value) {
                                                  if (typeof(value)==='string') {
                                                     if (value !== null && value !== undefined) {
                                                     return true;
                                                      }
                                                      else{
                                                        return false;
                                                      }
                                                  }
                                                  else{
                                                      if (value !== null && value !== undefined && value > -1) {
                                                         return true;
                                                      }
                                                      else{
                                                        return false;
                                                      }
                                                  }
                                                }
	    $scope.formatDate = function(date){
		var d = moment(date);
		return d.format(Package.DATE_FORMAT);
	    }
	    $scope.switchTab = function(sessionId){
                sharedUI.SelectedSessionId = sessionId;
                $scope.hideAllTabs();
                $("#sessionDefinition" + sessionId).css("display", "block");
                $("ul[id='sesionsMenu'] > li > a").removeClass("sub-tab-selected");
                $("ul[id='sesionsMenu'] > li > a").addClass("sub-tab-unselected");
                var li = $("#tab" + sessionId);
                li.removeClass('sub-tab-unselected');
                li.addClass("sub-tab-selected");
            }
            $scope.sessionsRenderFinished = function(){
                 if (utils.isNull(sharedUI.SelectedSessionId)===false) {
                     $scope.switchTab(sharedUI.SelectedSessionId);
                }
            }
            $scope.isActive = function(sessionId){
                if (sessionId === sharedUI.SelectedSessionId) {
                    return 'active';
                }
                return '';
            }
	    $scope.isNumericInput = function(owner,property){
                                                  utils.validateNumericInput(owner,property);
                                            }
	    shared.AddSession = function (session) {
	                   SortoutConstraints(session.SendingRequest.request);
                       sharedUI.AddSession(session);
                       sharedUI.SelectedSessionId = session.Id;
                       setTimeout(function () { $scope.switchTab(session.Id); }, 100);
                       
                       $scope.hideAllTabs();
                       if(!$scope.$$phase) {
                        $scope.$apply();
                       }
                    }
            
            $scope.SendPrice = function(sessionId){
                var session = sharedUI.GetSessionById(sessionId);
                com.SendPrice(sessionId,{price:session.price,remark:session.priceRemark});
                $('#btnRejectSession'+sessionId).prop('disabled','disable');
                
            }
            $scope.RejectSession = function(sessionId){
                        utils.ngApply($scope,function(){
                                    var sessionIdx = -1;
                                    $scope.Sessions.every(function(value,idx){
                                                        if (value.Id === sessionId) {
                                                                    sessionIdx = idx;
                                                                    return false;
                                                        }
                                                        return true;
                                            })  ;
                                    $scope.Sessions.splice(sessionIdx,1);
                                     if(!$scope.$$phase) {
                                                $scope.$apply();
                                               }
                        });
                        if ($scope.Sessions.length>0) {
                                     $scope.switchTab($scope.Sessions[0].Id);
                         }
                  
            }

            function SortoutConstraints(req) {
                var constraints = { courier: [], sender: [], receiver: [] };
                constraints.courier = SortoutConstraintsByOwner(req.constraints, 'courier');
                constraints.sender = SortoutConstraintsByOwner(req.constraints, 'sender');
                constraints.receiver = SortoutConstraintsByOwner(req.constraints, 'receiver');
                utils.ngApply($scope, function () {
                    req.constraints = constraints;
                });
               

            }
            function SortoutConstraintsByOwner(con, owner) {
                var result = [];
               
                con.every(function (value, idx) {
                    var c = cs.getConstraintForOwnerById(value, owner);
                    result = result.concat(c);
                    return true;
                });
                return result;
            }
           
           
        }]);