app.service('dialogService',[function(){
        return {
                alert:function(message){
                    var rendredMessage = '<div style="width:100%;text-align:center;margin-top:20px;" class="caption"+>'+
                                            message+
                                            '</div>';
                    
                    
                    bootbox.alert({message:rendredMessage});
                },
                confirm:function(message,callback){
                         var renderedMessage = '<div style="width:100%;text-align:center;margin-top:20px;" class="caption"+>'+
                                            message+
                                            '</div>';
                                            bootbox.confirm({message:renderedMessage,
                                                            callback:function(result){
                                                        if (typeof(callback) === 'function') {
                                                                callback(result);
                                                        }
                                                }});
                },
                yesNo:function(message,options){
                         var renderedMessage = '<div style="width:100%;text-align:center;margin-top:20px;" class="caption"+>'+
                                            message+
                                            '</div>';
                        bootbox.dialog({
                                message:renderedMessage,
                                buttons:{
                                                success:{
                                                        label:options.yesLabel,
                                                        className:'btn-success',
                                                        callback:options.yesCallback
                                                },
                                                danger:{
                                                  label:options.noLabel,
                                                  className:'btn-danger',
                                                  callback:options.noCallback
                                                }
                                        
                                        }
                                });
                        }
            };
    }]);