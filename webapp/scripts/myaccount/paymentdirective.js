app.directive('payment', ['shared', function (shared) {
    return {
        restrict: 'E',
        scope: {
            confirm: '&',
            cancel:'&'
        },
        templateUrl: function (elem, attrs) {
            return BASE_URL + 'scripts/myaccount/payment.html?'+Math.random();
        },
        replace: true,
        controller: function ($scope, $attrs) {
            $scope.checkPayment = function () {
                console.log('checkPayment probed ...');
                return shared.checkPayment;
            }
            $scope.close = function () {
                shared.checkPayment = false;
                if (typeof ($scope.cancel) === 'function') {
                    $scope.cancel();
                }
            }
            $scope.processConfirm = function () {
                shared.checkPayment = false;
                if (typeof ($scope.confirm) === 'function') {
                    $scope.confirm();
                }

            }
            $scope.onCheckPaymentChanged = function (newValue, oldValue) {
                console.log('changed...',newValue);
                if (newValue === true) {
                    $('#paymentDetails').modal({ backdrop: 'static' });
                }
                else {
                    $('#paymentDetails').modal('hide');
                }
            }
            $scope.$watch(function ($scope) {
                //console.log(shared.checkPayment)
                return shared.checkPayment

            }, $scope.onCheckPaymentChanged);
        }



    }
}]);
