var Config = {
   DEV:{
        DATABASE:{server:'localhost'
                  ,user:'vulf'
                  ,password:'mizu'},
        GENERAL:{client_mode:'SINGLE'
                ,server_mode:'SINGLE'
                ,debug:'true'
        },
        EMAIL:{server:'mail.expryse.com',
                auth:{
                    user:'vulfh@expryse.com',
                    pass:'Mizu1977'}
                },
        URL:{
                mail_approve:'http://localhost:3001/subscribe?Method=APPROVE-USER&UserId=',
                login:'http://localhost:3001/',
                base:'http://localhost:3001/'
               },
        ENCRYPTION:{password:'Gendalf777'}
       },
   PROD:{
        DATABASE:{server:'localhost'
                  ,user:'root'
                  ,password:'Lolik77'},
        GENERAL:{client_mode:'SINGLE'
                ,server_mode:'SINGLE'
                ,debug:'false'
                },
        EMAIL:{server:'mail.expryse.com',
                auth:{
                    user:'vulfh@expryse.com',
                    pass:'Mizu1977'}
                },
        URL:{
                mail_approve:'http://52.28.134.54/app/subscribe?Method=APPROVE-USER&UserId=',
                login:'http://52.28.134.54/app/',
                base:'http://52.28.134.54/app/'
                },
        ENCRYPTION:{password:'vsg7lkvdiop85f43'}
                  
       },
   PROD_DEBUG:{
        DATABASE:{server:'52.28.134.54'
                  ,user:'root'
                  ,password:'Lolik77'},
        GENERAL:{client_mode:'SINGLE'
                ,server_mode:'SINGLE'
                ,debug:'false'
                },
        EMAIL:{server:'mail.expryse.com',
                auth:{
                    user:'vulfh@expryse.com',
                    pass:'Mizu1977'}
                },
               
        URL:{
                mail_approve:'http://localhost:3001/subscribe?Method=APPROVE-USER&UserId=',
                login:'http://localhost:3001/',
                base:'http://localhost:3001/'
               },
        ENCRYPTION:{password:'Gendalf777'}
                  
       }
        
 
}
module.exports = Config;