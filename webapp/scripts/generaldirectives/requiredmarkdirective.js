app.directive('requiredMark', function () {
    return {
        restrict: 'E',
        template: '<span class="required-field-mark">*</span>'
    }
});