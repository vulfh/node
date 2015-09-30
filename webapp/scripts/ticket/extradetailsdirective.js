app.directive('extraDetails',function(){
        return {
           restrict:'E',
           require:'ngModel',
           scope:{
               selected: '=',
               title:'='
               },
            replace:true,
            controller:function($scope,$attrs){
                  $scope.selectionIcon='ticket-not-selected';
                  if ($scope.selected === true) {
                   $scope.selectionIcon='ticket-selected';
                  }
            }
           ,template:'<div class="table-cell" style="padding-right:10px;"><div class="table-row">'+
                            '<div style="vertical-align:middle;padding-left:10px;" class="caption table-cell">{{title}}</div>'+
                     '<div class="table-cell {{selectionIcon}}"></div></div></div>'
       }
    });