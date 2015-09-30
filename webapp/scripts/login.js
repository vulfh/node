var userPerspective = {};
userPerspective.SENDER=  1;
userPerspective.PROVIDER = 2;
userPerspective.DEAL_PACKAGES = 'deal_packages';

app.controller('loginController', ['$scope', '$http', 'shared', 'com','dialogService', function ($scope, $http, shared, com,dialogService) {
            $scope.login = function () {
                var userName = $('#txtUserName').val();
                var password = $('#txtPassword').val();
                $http.post(BASE_URL+'auth', { userName: userName, password: password }).
                        success(function (data, status, headers, config) {
                            shared.processLoginResponse(data, shared, com, function (data) {
                                if (data.success !== true) {
                                   dialogService.alert(data.description);
                                }
                                else {
                                    if (data.user.signedTOS===false) {
                                                 shared.showSignTOS();
                                               
                                    }
                                    else{
                                                com.Start();
                                    }
                                }
                            });
                        }).
                        error(function (data, status, headers, config) {
                            dialogService.alert('error');
                        });
            };
            $scope.subscribe = function(){
                shared.subscribe();
            }
        } ]);