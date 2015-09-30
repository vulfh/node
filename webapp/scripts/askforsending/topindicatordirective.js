var shippingTopIndicator = {
        restrict:'E',
        templateUrl : function(elem,attrs){
            return BASE_URL+'scripts/askforsending/indicator-stage-'+attrs.stage+'.html';            
        }
    };
app.directive('shippingTopIndicator',function(){
        return shippingTopIndicator;
    
    });