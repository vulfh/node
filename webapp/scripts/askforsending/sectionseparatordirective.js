var sectionSeparator = {
        restrict:'E',
        templateUrl : function(elem,attrs){
            return '<div style="width:100%;height:10px;margin-top:15px;margin-bottom:15px;" class="plus-package-background"></div>';            
        }
    };
app.directive('sectionSeparator',function(){
        return sectionSeparator;
    
    });