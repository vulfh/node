 app.controller('archive',['$scope','$http','shared','com','dialogService','archiveService'
                                  ,function($scope,$http,shared,com,dialogService,archiveService){
                                       utils.setupDatePicker('arcFromDate','DD, d MM, yy');
                                       utils.setupDatePicker('arcToDate','DD, d MM, yy');
                                       $scope.pageData = undefined;
                                       $scope.pageSize =5;
                                       $scope.currentPage = 1;
                                       $scope.packages = {};
                                       $scope.origins = shared.origins;
                                       $scope.selectedOrigin = $scope.origins[0];
                                       var currentDate = new Date();
                                       var yesterday = new moment(currentDate).add('days',-30).toDate();
                                       var tomorrow = new moment(currentDate).add('days',2).toDate();
                                       
                                       $('#arcFromDate').datepicker('setDate',yesterday);
                                       $('#arcToDate').datepicker('setDate',tomorrow);
                                       $scope.fromDate = $('#arcFromDate').val();
                                       $scope.toDate = $('#arcToDate').val();
                                       $scope.deliveryStatuses =[{id:1,name: 'טרם בוצע'},
                                                                 {id:2,name:'שליח בדרך לאיסוף משלוח'},
                                                                 {id:3,name: 'משלוח התקבל על ידי שליח'},
                                                                 {id:4,name: 'שליח בדרך לכתובת יעד'},
                                                                 {id:6,name: 'המשלוח נמסר'},
                                                                 {id:8,name: 'המוסר לא נמצא'},
                                                                 {id:9,name: 'נמצא בנקודת הקבלה'}];
                                   
                                       
                                       $scope.isActivePageId = function(pageId){
                                         var css = ""
                                         if (pageId == $scope.currentPage) {
                                             css = "active";
                                         }
                                         return css;
                                       }
                                       $scope.onupdate = function(data){
                                        com.SendGetMessage(BASE_URL+'archive/?method=update'
                                                               +'&dealId='+data.id
                                                               +'&deliveryStatusId='+data.deliveryStatusId
                                                               ,function(error){
                                                                    dialogService.alert(error);
                                                                }
                                                                ,function(data){
                                                                    
                                                                    });
                                       }
                                       $scope.expandPackagesClass = function(dealId){
                                        var baseClass = "glyphicon ";
                                        var specClass = "";
                                         if ($scope.packages[dealId]=== undefined || $scope.packages[dealId] === null) {
                                             specClass = "glyphicon-plus-sign";
                                         }
                                         else{
                                             if ($scope.packages[dealId].collapsed === true) {
                                                  specClass = "glyphicon-plus-sign";
                                             }
                                             else{
                                                  specClass = "glyphicon-minus-sign";
                                             }
                                         }
                                         return baseClass + specClass;
                                       }
                                       $scope.expand = function(dealId){
                                             if($scope.packages[dealId] === undefined || $scope.packages[dealId] === null){
                                                  $scope.packages[dealId] = {};
                                                  $scope.packages[dealId].collapsed = true;
                                                  
                                             }
                                             $scope.packages[dealId].collapsed = !$scope.packages[dealId].collapsed
                                             if ($scope.packages[dealId].collapsed === false) {
                                                  $scope.bringPackages(dealId);
                                             }
                                       }
                                       
                                       $scope.buildTimeFrameParams  = function(){
                                        var qs = '';
                                        var fromDate = escape($('#arcFromDate').val());
                                        var toDate = escape($('#arcToDate').val());
                                         if (fromDate !== undefined && fromDate !== null && fromDate !== '') {
                                            qs+='&startDate='+fromDate
                                         }
                                         if (toDate !== undefined && toDate !== null && toDate !=='') {
                                            qs+='&endDate='+toDate
                                         }
                                         return qs;
                                       }
                                       $scope.setupPagination = function(totalRows){
                                          var totalPages = Math.floor( totalRows / $scope.pageSize) ;
                                          if (totalRows % $scope.pageSize > 0) {
                                            totalPages++;
                                          }
                                          $scope.pages = [];
                                          for(var i=0;i<totalPages;i++){
                                            $scope.pages[i] = i+1;
                                          }
                                       }
                                       $scope.navigate =function(pageId){
                                        $scope.currentPage = pageId;
                                         $scope.search();
                                       }
                                       $scope.search = function(){
                                            archiveService.search($scope.currentPage
                                                               ,$scope.pageSize
                                                               ,$scope.buildTimeFrameParams()
                                                               ,$scope.selectedOrigin.id
                                                               ,function(error){
                                                                    dialogService.alert(error);
                                                                }
                                                                ,function(data){
                                                                    if (data.success===false) {
                                                                        dialogService.alert(data.description);
                                                                    }
                                                                    else{
                                                                        $scope.pageData=  data.data.contracts;
                                                                        $scope.setupPagination(data.data.totalAmountOfRows);
                                                                        
                                                                    }
                                                                    });
                                       }
                                       $scope.showPackages = function(dealId){
                                        if ($scope.packages[dealId]=== undefined || $scope.packages[dealId] === null){
                                             $scope.packages[dealId] = {};
                                             $scope.packages[dealId].collapsed = true;
                                        }
                                        return $scope.packages[dealId].collapsed;
                                       }
                                       $scope.showDealTicket = function(dealId){
                                             
                                       }
                                       $scope.bringPackages = function(dealId){
                                             com.SendGetMessage(BASE_URL+'archive/?method=deal_packages&dealId='+dealId
                                                               ,function(error){
                                                                      dialogService.alert(error);
                                                               }
                                                               ,function(data){
                                                                      $scope.packages[dealId].data = data.data.packages;
                                                                 });
                                             
                                       }
                                       $scope.isSender = function(deal){
                                        if (deal.contractorTypeId===userPerspective.SENDER) {
                                                       return true;
                                               }
                                               else{
                                                       return false;
                                               }
                                       }
                                       $scope.search();
                                    }]);