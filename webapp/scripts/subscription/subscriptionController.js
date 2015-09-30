app.controller('subscriptionController',['$scope','$http','subscriptionSvc','shared','com','dialogService', function($scope,$http,subscriptionSvc,shared,com,dialogService){
         $scope.isSender = false;
         $scope.isProvider=false;
         
         $scope.prefix1 = subscriptionSvc.phonePrefixes;
         $scope.phone1Prefix = $scope.prefix1[0];
         $scope.prefix2 = subscriptionSvc.mobilePrefixes;
         $scope.phone2Prefix = $scope.prefix2[0];
         
         function buildUser(){
             var user = {Method:'SAVE-USER',
                         FirstName:$scope.firstName,
                         LastName:$scope.lastName,
                         Email:$scope.email,
                         IsSender:$scope.isSender,
                         IsProvider:$scope.isProvider,
                         Phone1:$scope.phone1Prefix.desc+'-'+ $scope.phone1,
                         Phone2:$scope.phone2Prefix.desc+'-'+$scope.phone2,
                         Password: $scope.password
             };
             if (utils.isNull($scope.phone1) === true) {
                 user.Phone1 = '';
             }
             if (utils.isNull($scope.phone2) === true) {
                 user.Phone2 = '';
             }
                  return user;
         }
         function validateUser() {
             if (utils.isNullOrEmpty($scope.email)===true) {
                 dialogService.alert('כתובת דואר אלקטרונית הינו שדה חובה.');
                 return false;
             }
             if (utils.validateEmail($scope.email)===false) {
                 dialogService.alert('כתובת דואר אלקטרונית לא תקינה');
                 return false;
             }
             if (utils.isNullOrEmpty($scope.firstName) === true) {
                 dialogService.alert('שם פרטי הינו שדה חובה.');
                 return false;
             }
             if (utils.isNullOrEmpty($scope.lastName) === true) {
                 dialogService.alert('שם משפחה הינו שדה חובה.');
                 return false;
             }
             if (utils.isNullOrEmpty($scope.password) === true) {
                 dialogService.alert('סיסמה הינו שדה חובה.');
                 return false;
             }
             if (utils.isNullOrEmpty($scope.password) === true) {
                 dialogService.alert('שם משפחה הינו שדה חובה.');
                 return false;
             }
             if ($scope.repeatedPassword !== $scope.password) {
                 dialogService.alert('סיסמה לא מאומתת');
                 return false;
             }
             return true;
         }
          $scope.checkUserName = function(){
            //alert('kuku');
            subscriptionSvc.checkUserName($scope.userName,function(){},
                                                          function(isUnique){
                                                               if (isUnique !== true) {
                                                                        dialogService.alert('שם משתמש חייב להיות יחודי!');
                                                               }
                                                          }
                                          )                                      
         }
         
          $scope.checkEmail = function () {
              if (validateUser() === true) {
                  subscriptionSvc.checkEmail($scope.email, function () { },
                                                                function (isUnique) {
                                                                    if (isUnique !== true) {
                                                                        dialogService.alert('כתובת דואר אלקטרוני חייב להיות ייחודי!');
                                                                    }
                                                                }
                                                )
              }
            
         }
          $scope.saveUser = function () {
              var user = buildUser();
              if (validateUser()===true) {
                  subscriptionSvc.saveUser(user, function () { },
                                                function (result) {
                                                    if (result.success === false) {
                                                        dialogService.alert(result.description);
                                                    }
                                                    else {
                                                        shared.subscriptionAccepted(result);
                                                    }
                                                });

              }
          }

    
    }]);