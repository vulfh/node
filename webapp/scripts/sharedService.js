var sharedSvc = function ($http,dialog) {
            var user = undefined;
            var _self = this;
            this.onLogin = function () { };
            this.Http = $http;
            this.packageTypes = [];
            this.regions = [];
            this.constraints = {};
            this.checkPayment = false;
            function buildPackage(data) {
                var packageType = new Package();
                packageType.TypeId = data.Id;
                packageType.Name = data.Name;
                packageType.Width = data.Width;
                packageType.Length = data.Length;
                packageType.Weight = data.Weight;
                return packageType;
            }
            function loadConstraints() {
                $http({ method: 'GET', url: BASE_URL + 'common?type=get_constraints&r=' + Math.random() })
                .success(function (data, status, headers, config) {
                    self.contraints = data;
                })
                .error(function (data, status, headers, config) {
                    dialogService.alert("error loading constraints:" + data);
                });
            }
            function loadRegions(){
                 $http({url:BASE_URL+'common?type=get_regions&r='+Math.random()})
                                                 .success(function(data,status,headers,config){
                                                        _self.regions = data;
                                                      //  _self.regions.unshift({Id:0,name:'כל האזורים'});
                                                     
                                                    })
                                                 .error(function(data,status,headers,config){
                                                    dialogService.alert("error:"+ data);
                                                    });
            }
            function loadOrigins(){
                $http({method:'GET',url:BASE_URL+'common?type=get_origins&r='+Math.random()})
                .success(function(data,status,headers,config){
                        _self.origins = data;
                    })
                .error(function(data,status,headers,config){
                        dialogService.alert('error:'+data);
                    });
            }
            function loadCreditCardTypes() {
                $http({ method: 'GET', url: BASE_URL + 'common?type=get_credit_card_types&r=' + Math.random() })
                .success(function (data, status, headers, config) {
                    _self.creditCardTypes = data;
                })
                .error(function (data, status, headers, config) {
                    dialogService.alert('error' + data);
                });
            }
            function loadPackages(){
                 $http({
                    method:'GET'
                   ,url:BASE_URL+'common?type=get_package_types'
                  })
            .success(function(data,status,head,config){
                    for (var i =0;i<data.length;i++) {
                            var packageType = buildPackage(data[i]);
                           _self.packageTypes.push(packageType);
                           $http({
                                   method:'GET'
                                  ,url :BASE_URL+'common?type=get_package_types?parentPackageTypeId='+packageType.Id
                           })
                           .success(function(data,status,header,config){
                                   for (var si =0;i<data.length;i++) {
                                       var subPackage = buildPackage(data[i]);
                                       packageType.SubPackages.push(subPackage);
                                   }
                               });
                       
                       }
                    }
                );
            }
            loadRegions();
            loadOrigins();
            loadCreditCardTypes();

            this.showTicket = function(deal){
                this.popupLoaded = function(){
                         $('#dealTicket').modal({ backdrop: 'static' });
                        _self.onShowTicket(deal);
                    };
                this.loadPopupPage(BASE_URL+'controls/ticket.html?'+Math.random());
            }
            
           

            this.showNewInterestArea = function(interest){
                $('#interestDetails').modal({backdrop:'static'});
                _self.onLoadInterestDetails(interest);
              //  $("#interestDetails").animate({"width":"1000px","margin-left":"-500px"},1000,'linear');
            }
            this.onShowTicket = function(deal){
                dialogService.alert('no callback !');
            }
            this.onLoadArchiveDetails = function(){};
            this.onLoadPopupPage = function(page){
                dialogService.alert('no call back for popup page !');
            }
            this.loadPopupPage = function(page){
                this.onLoadPopupPage(page);
            }
            this.processLoginResponse = function (data, shared, com, handler) {
                if (data.success) {
                    shared.menu = data.menu;
                    shared.user = data.user;
                    shared.onLogin();
                    com.ListenToNewSession('session_listener', function (eventType,data) {
                        if (shared.AddSession !== undefined) {
                            shared.AddSession(data);
                        }
                    });
                }
                if (handler !== undefined) {
                    handler(data);
                }
            }
            this.showSignTOS = function(){
                 this.popupLoaded = function(){
                                                    $('#tosPopup').modal({ backdrop: 'static' });
                                                };
                 this.loadPopupPage(BASE_URL+'pages/SignTOS.html?'+Math.random());
            }
            this.getCitiesByRegion = function(regionId){
                var cities = [];
                _self.Cities.every(function(value,idx){
                        if (value.regionId === regionId) {
                            cities.push(value);
                        }
                        return true;
                    });
                return cities;
            }
            this.getCityById = function(cityId){
                var city;
                _self.Cities.every(function(value,idx){
                        if (value.Id === cityId) {
                            city = value;
                            return false;
                        }
                        else{
                            return true;
                        }
                    });
                return city;
            }
            this.getStreetById = function(streets,streetId){
                var street;
                streets.every(function(value,idx){
                        if (value.Id === streetId) {
                            street = value;
                            return false;
                        }
                        else{
                            return true;
                        }
                    });
                return street;
            }
            
            this.getStreetsOfCity = function(cityId,resultHandler){
               //
                _self.Http({
                    method:'GET',
                    url:BASE_URL+'common?type=get_streets&cityId='+cityId
                })
                .success(function(data,status,head,config){
                        if (resultHandler !== undefined && resultHandler !== null) {
                            data.unshift({Id:-1,Name:'---בחר רחוב---'});
                            resultHandler(data);
                        }
                    })
                .error(function(data,status,head,config){
                        dialogService.alert(data);
                    });
            }
           
            }
 app.factory('shared', ['$http','dialogService',function ($http,dialogService) {
            return new sharedSvc($http,dialogService);
        } ]);