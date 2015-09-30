 var Shipping = utils.isNull(Shipping)?{}:Shipping;
 Shipping.Interest = {};
 Shipping.Interest.Definition =function (){
           var _self = this;
           
           this.reset = function(){
                      _self.init();
                      _self.Scheduler.every(function(value,idx){
                                        if(value.Id in [0,1,2,3,4]){
                                            value.Selected = true;
                                        }
                                        return true;
                                 });
                      _self.Packages[0].Selected = true;
           }
           this.init = function(){
                      this.id = undefined;
                      this.name = undefined;
                      this.maxInsuranceValue = 0;
                      this.freeze = false;
                      this.isolation = false;
                      this.fragile = false;
                  _self.Scheduler = [{Id:0,
                       Name:'יום ראשון',
                       Selected:false,
                       FromTime:'00:00',
                       TillTime:'23:59'},
                       {Id:1,
                       Name:'יום שני',
                       Selected:false,
                       FromTime:'00:00',
                       TillTime:'23:59'},
                       {Id:2,
                       Name:'יום שלישי',
                       Selected:false,
                       FromTime:'00:00',
                       TillTime:'23:59'},
                       {Id:3,
                       Name:'יום רביעי',
                       Selected:false,
                       FromTime:'00:00',
                       TillTime:'23:59'},
                       {Id:4,
                       Name:'יום חמישי',
                       Selected:false,
                       FromTime:'00:00',
                       TillTime:'23:59'},
                       {Id:5,
                       Name:'יום שישי',
                       Selected:false,
                       FromTime:'00:00',
                       TillTime:'23:59'},
                       {Id:6,
                       Name:'יום שבת',
                       Selected:false,
                       FromTime:'00:00',
                       TillTime:'23:59'}
                       ]
                      this.Packages = [
                                       new Envelope(),
                                       new RegularPackage(),
                                       new RegularPlatform()
                                       ];
                      this.Packages[0].Selected = false;
                      this.Packages[1].Selected = false;
                      this.Packages[2].Selected = false;     
                      
                      }
               this.reset();
           };
 
 

angular.module("mockup").controller("defineInterestController", ['$scope','shared','$http','dialogService', function ($scope,shared,$http,dialogService) {
    $scope.packageCounter = 0;
    $scope.name = "";
    $scope.freeze = false;
    $scope.fragile = false;
    $scope.isolation = false;
    $scope.id = undefined;
    $scope.interestDefinition = new Shipping.Interest.Definition();
    $scope.packageDefinitions = [new PackageDefinition("di", $scope.packageCounter++)];
    $scope.packageDefinitions[0].SetIndex(0);
    $scope.saved = true;
    function  buildInterestInfo(){
           var interestInfo = {};
           interestInfo.interestName = $scope.interestDefinition.name;
           interestInfo.interestId = $scope.interestDefinition.id;
           interestInfo.hasFreeze = $scope.interestDefinition.freeze;
           interestInfo.hasFragile = $scope.interestDefinition.fragile;
           interestInfo.hasIsolation = $scope.interestDefinition.isolation;
           interestInfo.maxInsuranceValue = $scope.interestDefinition.maxInsuranceValue;
           interestInfo.regions = buildRegions();
           interestInfo.packages = buildPackages();
           interestInfo.scheduler = buildScheduler();
           interestInfo.method = 'SAVE';
           return interestInfo;
    }
    function resetRegions() {
           $scope.areas.every(function(value,idx){
                                 value.selected = false;
                      });
           $scope.selectedAreas = [];
    }
    function getPackageByTypeId(ptid){
           var pac = null;
           $scope.interestDefinition.Packages.every(function(value,idx){
                                 if (value.TypeId === ptid) {
                                            pac = value;
                                            return false;
                                 }
                                 return true;
                      });
           return pac;
    }
    function getDayById(did){
           var day = null;
           $scope.interestDefinition.Scheduler.every(function(value,idx){
                      if (value.Id === did) {
                                 day = value;
                                 return false;
                      }
                      return true;           
           });
           return day;
    }
    function getRegionById(rid){
           var reg= null;
           $scope.areas.every(function(value,idx){
                      if (value.Id === rid) {
                                reg =value;
                                 return false;
                      }
                      return true;
                      });
           return reg;
    }
    function buildRegions(){
           var regions = [];
           $scope.areas.every(function(value,idx){
                                 if(value.selected=== true){
                                                   regions.push(value.Id);    
                                            };
                                 return true;
                      });
           return regions;
    }
    

    
    function buildPackages(){
           var packages = [];
           $scope.interestDefinition.Packages.every(function(value,idx){
                                 if(value.Selected === true){
                                            packages.push(value);
                                 }
                                 return true;
                      });
           return packages;
    }
    function buildScheduler(){
           var scheduler = [];
           
           $scope.interestDefinition.Scheduler.every(function(value,idx){
                              if(value.Selected === true){
                                 scheduler.push(value);
                              }
                              return true;
                      });
           return scheduler;
    }
    $scope.init = function(interestData){
            $scope.areas = [];
            $scope.selectedAreas = [];
            shared.regions.every(function(value,idx){
                                                        $scope.areas.push({Id:value.Id,name:value.name,selected:false});
                                                        return true;
                                                     });
            resetRegions(); 
           if (utils.isNull(interestData)===true) {
                 $scope.interestDefinition.reset();
                 $scope.saved = false;
           }
           else{
                $scope.interestDefinition.init();      
                $scope.interestDefinition.name = interestData.InterestName;
                $scope.interestDefinition.fragile = interestData.Fragile;
                $scope.interestDefinition.freeze = interestData.HasFreeze;
                $scope.interestDefinition.isolation = interestData.HasIsolation;
                $scope.interestDefinition.id = interestData.InterestId;
                $scope.interestDefinition.maxInsuranceValue = interestData.MaxInsuranceValue;
                
                interestData.Packages.every(function(value,idx){
                                 var pac = getPackageByTypeId(value.PackageTypeId);
                                 if (utils.isNull(pac)===false) {
                                            pac.Selected = true;
                                            pac.Length = value.MaxLength;
                                            pac.Weight = value.MaxWeight;
                                            pac.Width = value.MaxWidth;
                                            pac.Height = value.MaxHeight;
                                 }
                                 return true;
                                 
                      });
                interestData.Regions.every(function(value,idx){
                       var reg = getRegionById(value.RegionId);
                       
                       if (utils.isNull(reg)===false) {
                                 $scope.areaStateChanged(reg);
                                 reg.selected = true;
                       }
                       return true;
                       
                      });
                interestData.Scheduler.every(function(value,idx){
                        var day = getDayById(value.Id);
                        if (utils.isNull(day)=== false) {
                                 day.Selected = true;
                                 day.FromTime = value.FromTime;
                                 day.TillTime = value.ToTime;
                        }
                        return true;
                      });
                $scope.orginalInterestInfo = buildInterestInfo();
                
           }
          
            
    }
    
    $scope.close= function(justClose){
                      if (justClose!==true) {
                                 
                              var interestInfo = buildInterestInfo();
                              if (utils.compare(interestInfo,$scope.orginalInterestInfo) ===    false || $scope.saved === false) {
                                        dialogService.confirm('בצעת שינוים. האם תרצה/י לשמור אותם ?',function(result){
                                          if(result === true){
                                                    $scope.save(interestInfo);
                                        }
                                        });
                              }
                      }
                      $('#interestDetails').modal('hide');
    }
    $scope.save = function(interestInfo){
           if (utils.isNull(interestInfo)===true) {
                  interestInfo = buildInterestInfo();
           }
            
           
           $http.post('./interest',interestInfo)
           .success(function(data,status,headers,config){
                                 if (data.success === true) {
                                            shared.onInterestSaved(); 
                                            dialogService.alert('נשמר בהצלחה !');
                                            $scope.close(true);
                                            
                                 }
                                 else{
                                            dialogService.alert(data.description);
                                 }
                      })
           .error(function(data,status,headers,config){});
           
    }
    
    $scope.areaStateChanged =function(area){
           if (area.selected == false) {
                      var sa = {Id:area.Id,name:area.name};
                      sa.cities = shared.getCitiesByRegion(sa.Id);
                      $scope.selectedAreas.push(sa);
           }
           else{
                      $scope.selectedAreas.every(function(value,idx){
                                            if (value.Id === area.Id) {
                                                       $scope.selectedAreas.splice(idx,1);
                                                       return false;
                                            }
                                            return true;
                                 });
                      
           }
    }
   
     shared.onLoadInterestDetails = function(interestData){
           $scope.init(interestData);
           }
    
} ]);

angular.module('mockup').controller('interestListController', ['$scope', '$http', 'shared', 'dialogService', function ($scope, $http, shared, dialogService) {
                    $scope.items= [];
                    shared.loadPopupPage(BASE_URL+'controls/DefineInterest.html');
                    $scope.addNewInterest = function (interestId){
                                 if (utils.isNull(interestId)===true) {
                                            shared.showNewInterestArea();
                                 }
                                 else{
                                            $http(
                                                       {method:'POST',
                                                        url:BASE_URL+'interest?method=DETAILS&interestId='+interestId+'&r='+Math.random()}
                                            )
                                            .success(function(data,status,headers,config){
                                                       shared.showNewInterestArea(data.data.data);
                                                       })
                                            .error(function(data,status,headers,config){
                                                       dialogService.alert('error');
                                                       })
                                            
                                 }
                                 
                                 
                      }
                      $scope.loadData = function(){
                                 $http({method:'POST',
                                        url:BASE_URL+'interest?method=MASTER&r='+Math.random()})
                                 .success(function(data,status,headers,config){
                                     if (data.success === true) {
                                            $scope.items = data.data.data;
                                     }
                                     else{
                                             dialogService.alert(data.description);
                                     }
                                     
                                 });
                     }
                     $scope.loadData();
                     shared.onInterestSaved = function(){
                                 $scope.loadData();
                     }
    
           $scope.deleteItem = function(id){
                      var iData = {interestId:id,
                                   method:'DELETE'};
                                   dialogService.confirm('האם ברצונך למחוק את תחום ההתעניינות?',function(result){
                                                        if( result === true){
                                                                      $http.post('./interest',iData)
                                                                       .success(function(data,status,headers,config){
                                                                                             if (data.success === true) {
                                                                                                        $scope.loadData();
                                                                                                        dialogService.alert('נמחק בהצלחה!');
                                                                                                        
                                                                                             }
                                                                                             else{
                                                                                                        dialogService.alert(data.description);
                                                                                             }
                                                                                  })
                                                                       .error(function(data,status,headers,config){});
                                                        }
                                   });
                      }
    }
        
    ]);