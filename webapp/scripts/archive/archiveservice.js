function ArchiveService(com,$timeout,shared){
    var self = this;
    self.$timeout = $timeout;
    self.com = com;
    self.shared = shared;
    self.currentQuery = undefined;
    function buildQuery(currentPage,pageSize,timeFrame,originId){
        return 'method='+self.shared.user.perspectives[0]
            +'&pageId='+currentPage
            +'&pageSize='+pageSize+timeFrame
            +'&deliveryStatusOriginId='+originId;
            
    }
    function bringData(query,errorCallback,callback) {
        self.com.SendGetMessage(BASE_URL+'archive/?'+query+'&r='+Math.random(),errorCallback,function(data){
                self.currentQuery = query;
                if (self.shared.user.perspectives[0] == 'sender_contracts') {
                   updatePage(query,callback);
                }
                if (self.currentQuery===query) {
                  callback(data);
                }
            });
    }
    function updatePage(query,callback){
        $timeout(function(){
                if (query===self.currentQuery) {
                    bringData(query,function(error){},callback);
                }
            },2000,true);
    }
    self.search = function(currentPage,pafeSize,timeFrame,originId,errorCallback,callback){
        var query = buildQuery(currentPage,pafeSize,timeFrame,originId);
         bringData(query,errorCallback,callback);
    }
}
app.factory('archiveService',['com','$timeout','shared',function(com,$timeout,shared){
        return new ArchiveService(com,$timeout,shared);    
    }]);