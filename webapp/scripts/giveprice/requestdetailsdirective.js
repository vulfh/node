app.directive('requestDetails',function(){
        return {
                restrict:'E',
                scope:{
                    request:'='
                },
                templateUrl : function(elem,attrs){
                            return BASE_URL+'scripts/giveprice/requestdetails.html';
                },
                replace:true,
                controller:function($scope,$attrs){
                    $scope.s = $scope.request;
                    $scope.formatDate = function(date){
                        var d = moment(date);
                        return d.format(Package.DATE_FORMAT);
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
                    
                    
                }
                
            };
    });