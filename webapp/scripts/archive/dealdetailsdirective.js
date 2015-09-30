app.directive('dealDetailsSender',function(){
        return {
            
            restrict:'E',
            scope:{
                deal:'=',
            },
            templateUrl:function(elem,attrs){
                   return BASE_URL+'./scripts/archive/dealdetails-sender.html';
                },
            replace:true, 
            controller:function($scope,$attrs){
                $scope.statusClass = function(statusId){
                        var style = '';
                        switch(statusId){
                                case 1:
                                     style='archive-deal-status-not-in-process';   
                                        break;
                                default:
                                        style= 'archive-deal-status-in-process';
                                        break;
                        }
                        return style;
                }
                console.log($scope.deal);    
            }
            
            
        }
    
    });
app.directive('dealDetailsProvider',function(){
        return {
            
            restrict:'E',
            scope:{
                deal:'=',
                statuses:'=',
                onupdate:'='
            },
            templateUrl:function(elem,attrs){
                   return BASE_URL+'./scripts/archive/dealdetails-provider.html';
                },
            replace:true, 
            controller:function($scope,$attrs){
                $scope.deliveryStatus = $scope.statuses[0];
                $scope.statusClass = function(statusId){
                        var style = '';
                        switch(statusId){
                                case 1:
                                     style='archive-deal-status-not-in-process';   
                                        break;
                                default:
                                        style= 'archive-deal-status-in-process';
                                        break;
                        }
                        return style;
                }
                $scope.saveUpdate = function(){
                        var data = {};
                        data.id = $scope.deal.id;
                        data.deliveryStatusId = $scope.deliveryStatus.id;
                        $scope.onupdate(data);
                }
                $scope.setCurrentDeliveryStatus = function(){
                        $scope.statuses.every(function(value,idx){
                                        if (value.id === $scope.deal.DeliveryStatusId) {
                                                $scope.deliveryStatus = value;
                                                return false;
                                        }
                                        else{
                                                return true;
                                        }
                                });
                }
                $scope.setCurrentDeliveryStatus();
                console.log($scope.deal);    
            }
            
            
        }
    
    });