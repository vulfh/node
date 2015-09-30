app.controller('ticketController', ['$scope', '$http', 'shared', 'constraintsSvc', function ($scope, $http, shared, constraintsSvc) {
    shared.onShowTicket = function(deal){
        $scope.dealId = deal.dealId;
        $scope.pickupAddress = deal.pickupAddress;
        $scope.deliveryAddress = deal.deliveryAddress;
        $scope.pickupDate = moment(deal.pickupDate).format(Package.DATE_FORMAT);
        $scope.pickupTime = ' מ-'+deal.pickupStartTime+' עד '+deal.pickupEndTime;
        $scope.deliveryDate = moment(deal.pdeliveryDate).format(Package.DATE_FORMAT);
        $scope.deliveryTime = ' מ-'+deal.deliveryStartTime+' עד '+deal.deliveryEndTime;;
        $scope.providerRemark = deal.providerRemark;
        $scope.pickupPhone = deal.pickupPhone;
        $scope.deliveryPhone = deal.deliveryPhone;
        $scope.pickupEmail = deal.pickupEmail;
        $scope.deliveryEmail = deal.deliveryEmail;
        $scope.pickupContactPerson = deal.pickupContactPerson;
        $scope.deliveryContactPerson = deal.deliveryContactPerson;
        $scope.constraints = constraintsSvc.buildConstraintsObjectFromIds(deal.constraints);
        
        $scope.packages = deal.packages;
        $scope.yesNo = function(value){
            if (value === true) {
                return 'כן';
            }
            else{
                return 'לא';
            }
        }
    }
    $scope.close = function(){
        $('#dealTicket').modal('hide');
    }
    }]);