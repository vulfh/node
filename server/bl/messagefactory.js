    var MessageFactory  =function()
    {
        
    }

    MessageFactory.CreateSessionCreated = function (session) {
        return { EventName: 'new_session', Content: session, Target: 'session_listener' };
    }
    MessageFactory.CreateNewPrice = function(price){
        return { EventName:'session_update',EventType:'new_price',Content:price,Target:price.SessionId };
    }
    MessageFactory.CreateNewDeal = function(dealDetails){
        return{EventName:'session_update',EventType:'new_deal',Content:dealDetails,Target:dealDetails.SessionId};
    }
    MessageFactory.CreateRejectPrice = function(sessionId,priceProviderId,reason){
        return{EventName:'session_update',EventType:'price_reject',Content:{Reason:reason,SessionId:sessionId},Target:sessionId};
    }
module.exports = MessageFactory;