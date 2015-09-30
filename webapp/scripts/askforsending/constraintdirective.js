var constraintDirective = function () {
    return {
        restrict: 'E',
        templateUrl: function (elem, attrs) {
            return BASE_URL + 'scripts/askforsending/constraints.html';
        },
        scope: {
           constraint:'='
        },
        replace:true
        
    };
}
app.directive('constraint', constraintDirective);