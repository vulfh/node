var xmlBuilder = require('xmlbuilder');
var Moment = require('moment');
var CommonMethods = require('../commonmethods.js');
var xmlHelper = {};

xmlHelper.BuildPackagesXml = function(packages){
        
        var packagesXml = xmlBuilder.create('packages');
        for (var i =0;i<packages.length;i++) {
            var packageElement = packagesXml.ele('package')
                                 .att('length', packages[i].Length)
                                 .att('width', packages[i].Width)
                                 .att('height', packages[i].Height)
                                 .att('weight', packages[i].Weight)
                                 .att('insuranceValue', packages[i].InsuranseValue)
                                 .att('typeId', packages[i].Type.id)
                                 .att('fragile', (packages[i].Fragile === true ? 1 : 0))
                                 .att('isolation', (packages[i].IsolationNeeded === true ? 1 : 0))
                                 .att('freeze', (packages[i].FreezeNeeded === true ? 1 : 0))
                                 .att('amount', (packages[i].Amount ? packages[i].Amount : 1));
                                  
        }
        packagesXml.end({pretty:true});
        
        //Logger.debug(packagesXml.toString({pretty:true}));
        return '<?xml version="1.0"?>'+packagesXml;
    }
//////////////////////////////////////////////////////////////////////////////////////////////    
xmlHelper.BuildDealXml = function(request,price){
        var dealXml  = xmlBuilder.create('deal');
        dealXml.att('priceId',price.Id);
        var pickupElement = dealXml.ele('pickup')
                            .att('streetId',request.PickupStreet.Id)
                            .att('cityId',request.PickupCity.Id)
                            .att('house',request.PickupHouse.Number)
                            .att('floor',CommonMethods.evaluateNull(request.PickupHouse.Floor))
                            .att('appartment',CommonMethods.evaluateNull(request.PickupHouse.Appartment))
                            .att('date',request.PickupDate)
                            .att('startTime',Moment(request.StartTime).format('HH:MM'))
                            .att('endTime',Moment(request.EndTime).format('HH:MM'));
        var deliveryElement = dealXml.ele('delivery')
                            .att('streetId',request.DeliveryStreet.Id)
                            .att('cityId',request.DeliveryCity.Id)
                            .att('house',request.DeliveryHouse.Number)
                            .att('floor',CommonMethods.evaluateNull(request.DeliveryHouse.Floor))
                            .att('appartment',CommonMethods.evaluateNull(request.DeliveryHouse.Appartment))
                            .att('date',request.DeliveryDate)
                            .att('startTime',Moment(request.StartTime).format('HH:MM'))
                            .att('endTime',Moment(request.EndTime).format('HH:MM'));
        dealXml.end({pretty:true});
        return '<?xml version="1.0"?>' + dealXml;
        
    }
/////////////////////////////////////////////////////////////////////////////////////////////////    
xmlHelper.BuildRegionsXml = function(regions){
        var regionsXml = xmlBuilder.create('regions');
        regions.every(function(value,idx){
                regionsXml.ele('region')
                .att('id',value);
                return true;
            });
        regionsXml.end({pretty:true});
        return '<?xml version="1.0"?>' + regionsXml;
    }
////////////////////////////////////////////////////////////////////////////////////////////////////
xmlHelper.BuildSchedulerXml = function(scheduler){
    var schedulerXml = xmlBuilder.create('scheduler');
    scheduler.every(function(value,idx){
            schedulerXml.ele('day')
            .att('id',value.Id)
            .att('from',value.FromTime)
            .att('to',value.TillTime);
            return true;
        });
    schedulerXml.end({pretty:true});
    return '<?xml version="1.0"?>' +schedulerXml;
}
module.exports = xmlHelper;