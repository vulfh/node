app.directive('creditCard',[ 'shared',function (shared) {
    return {
        restrict: 'E',
        scope: {
            details:'='
        },
        templateUrl: function (elem, attrs) {
            return BASE_URL + 'scripts/myaccount/creditcard.html';
        },
        replace: true,
        controller: function ($scope, $attrs) {
            $scope.creditCardTypes = shared.creditCardTypes;
            $scope.selectedCreditCardType = $scope.creditCardTypes[0];
        }

    }
}]);
