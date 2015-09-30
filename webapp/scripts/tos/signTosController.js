app.controller('signTosController',['$scope','shared','signTos','dialogService',function($scope,shared,signTos,dialog){
        $scope.tos= BASE_URL+'controls/tos.html';
        $scope.windowStyle = function(){
            var style ='';
            style+='height:'+window.screen.height*0.5+'px;overflow-y:scroll';
            return style;
        }
        $scope.sign = function(){
                signTos.sendSignature(function(success){
                                if (success === true) {
                                       $('#tosPopup').modal('hide');
                                }
                                else{
                                        dialog.alert('קרתה שגיאה בליחת החתימה.');
                                 
                                }
                        });
        }
    }]);