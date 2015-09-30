 angular.module("mockup").controller('mainController', ['$scope', '$http', 'shared', 'com','dialogService', function ($scope, $http, shared, com,dialogService) {
            $scope.ticket='./controls/ticket.html';
            $scope.template = './pages/SimplifiedSubscribe.html?'+Math.random();
            shared.onLoadPopupPage = function(page){
                utils.ngApply($scope,function(){
                      $scope.ticket = page;
                      });
            }
            $http({url:BASE_URL+'common?type=get_cities'})
                                                 .success(function(data,status,headers,config){
                                                        $scope.Cities = data;
                                                        shared.Cities = data;
                                                        CITIES = data;  
                                                    })
                                                 .error(function(data,status,headers,config){
                                                     dialogService.alert("error:"+ data);
                                                    });
            $http.post(BASE_URL+'auth')
            .success(function (data, status, headers, config) {
                shared.processLogoffResponse = function(){
                    $scope.userInfo = BASE_URL+'controls/login.html?'+Math.random();
                    $scope.topMenu = ''
                    $scope.template = BASE_URL+'pages/SimplifiedSubscribe.html?'+Math.random();
                    com.Stop();
                }
                shared.processLoginResponse(data, shared, com, function (data) {
                    if (data.success !== true) {
                        $scope.userInfo = BASE_URL+"controls/login.html?" + Math.random();
                        $scope.topMenu = '';
                    }
                    else{
                      if (data.user.signedTOS===false) {
                                                 shared.showSignTOS();
                                    }
                                    else{
                                          com.Start();
                                    }
                    }
                });
            })
            .error(function (data, status, headers, config) {
            });

            $scope.loaded = function(){
                if (shared.popupLoaded!==undefined && shared.popupLoaded!==null) {
                    shared.popupLoaded();
                }
            }
            shared.subscribe = function(){
                $scope.topMenu = '';
                $scope.template = BASE_URL+'pages/Subscribe.html';
            }
            shared.subscriptionAccepted = function(data){
                $scope.topMenu = '';
                $scope.template = BASE_URL+'pages/SubscriptionAccepted.html';
            }
            shared.switchPage = function (id) {
                $("li>div").removeClass('top-menu-tab-active');
                $("li>div").addClass('top-menu-tab-inactive')
                var liId = '#topMenuItem' + id+'>div';
                var li = $(liId);
                li.addClass('top-menu-tab-active');
                if (shared.menu.menu[id].Link !== '') {
                    $scope.template = shared.menu.menu[id].Link + '?' + Math.random();
                }
                else {
                    $scope.template = "";
                }
            }
            shared.setUserInfo = function(){
                 $scope.userName = shared.user.name;
                shared.updateStylesAsLoggedIn();
            }
            shared.updateStylesAsLoggedIn = function(){
                 $('#userInfo').removeClass('col-sm-5');
                 $('#userInfo').addClass('col-sm-4');
                 $('#logo').removeClass('col-sm-offset-4');//.removeClass('col-sm-3');
                 $('#logo').addClass('col-sm-offset-5');
            }
            shared.updateStylesAsLoggedOff = function(){
                 $('#userInfo').removeClass('col-sm-4');
                 $('#userInfo').addClass('col-sm-5');
                 $('#logo').removeClass('col-sm-offset-5');//.removeClass('col-sm-3');
                 $('#logo').addClass('col-sm-offset-4');
            }
            shared.onLogin = function () {
                $scope.userInfo = BASE_URL+'controls/logout.html';
                $scope.topMenu = BASE_URL+'controls/topmenu.html?' + Math.random();
            }
             $scope.logoff = function(){
                $http.post(BASE_URL+'logoff')
                .success(function(data,status,headers,config){
                    shared.updateStylesAsLoggedOff(); 
                    shared.processLogoffResponse();
                    });
            }
        } ]);