var mysql = require('mysql-native');
var nodeMysql = require('mysql');
var User = require('../user/user.js');
var UserPermission = require('../user/userpermission.js');
var Session = require('../../server/bl/session.js');
var Price = require('../data/price.js');
var DealDetails = require('../data/dealdetails.js');
var Package = require('../data/request/package.js');
var CommonMethods = require('../commonmethods.js');
var queries = require('./queries.js');
var QueryCompiler = require('../template.js');
var xmlHelper = require('./xmlhelper.js');
var Moment = require('moment');
var db = function (logger,config) {
    var _self = this;
    var Logger = logger;
    var Config = config;
    var client = undefined;
    var _queryCompiler = undefined;
    _moduleName = '[DAL]';
    _self.SENDER_CONTRACTOR = 1;
    _self.PROVIDER_CONTRACTOR = 2;
    _self.server = Config.get('DATABASE','server');//'localhost';
    _self.userName = Config.get('DATABASE','user');//'root';
    _self.password = Config.get('DATABASE','password');//'';
    
    var builder = new QueryCompiler.CompilerBuilder().createBuilder();
    _queryCompiler = builder.create(Logger).get();
    
    var EstablishConnection = function(){
        var conn = nodeMysql.createConnection(
                                                {
                                                  host:_self.server,
                                                  user:_self.userName,
                                                  password:_self.password
                                                }
                                                );
        conn.connect();
        return conn;
    }
    var Connect = function(){
        client = mysql.createTCPClient();
        client.auth('shipping', _self.userName,_self.password);
        client.set('charset','utf8_general_ci');
      
       
        client.query("SET NAMES utf8");
        client.query('USE shipping');
        client.query("SET character_set_client=utf8,character_set_connection=utf8");  
    }
    ////////////////////////////////COMPILE QUERY///////////////////////////////
 
/////////////////////////////////////////////////////////////////////////////    
    var SavePackages = function(conn,requestId,packagesXml,resultHandler){
        var query = _queryCompiler.CompileQuery(queries.InsertPackagesOfRequest,{RequestId:requestId,Xml:packagesXml});
        conn.query(query,function(err,rows){
            if (err !== undefined && err !== null) {
                Logger.error('Error while inserting packages of request ',requestId,err);
            }
                resultHandler(conn);
            });
    }
    var GetUserProfile = function (user, resultHandler, resultMessage) {
        Connect();
        var params = { UserId: user.id };
        var query = _queryCompiler.CompileQuery(queries.GetUserProfile, params);
        client.query(query)
            .on('row', function (row) {
                var permission = new UserPermission(row.PermissionId, false);
                user.AddPermission(permission);
            })
            .on('end', function (result) {
                if (resultHandler !== undefined) {
                    resultHandler(resultMessage, user);
                }
                client.close();

            });
    }
var SaveContract = function(contractDetails,conn,resultHandler){
    var query  = _queryCompiler.CompileQuery(queries.InsertDealContract,contractDetails);
    Logger.debug('Saving Contract details ',contractDetails);
    conn.query(query,function(err,rows){
        if (CommonMethods.isNull(err)=== true) {
            Logger.error('Error while saving deal contract ',err);
        }
            if (resultHandler !== undefined && resultHandler !== null) {
                resultHandler(err,rows);
            }
        });
  }
  var ConvertBitToBool = function(value){
        if (value[0] === 1) {
            return true;
        }
        else{
            return false;
        }
  }
    ////////////////////////////////////////////////////////////
    this.Login = function (userParam, resultHandler) {
        
        var params = { userName: userParam.userName, password: userParam.password,userId:userParam.userId };
        var query = undefined;
        if (CommonMethods.isNull(params.userId) === true) {
            query = _queryCompiler.CompileQuery(queries.GetUserData, params);
        }
        else {
            query = _queryCompiler.CompileQuery(queries.GetUserDataByUserId, params);
        }
        var resultMessage = { message: '', code: -1 };
        var user = null;
        Logger.debug('Starting Login in front data base with query :',query);
        Connect();
        client.query(query)
                .on('row', function (row) {
                    Logger.debug('Login succeeded.Result:',row);
                    resultMessage.message = 'ok';
                    resultMessage.code = 0;
                    user = new User();
                    user.id = row.UserId;
                    user.userName = row.UserName;
                    user.password = row.Password;
                    user.signedTOS = row.SignedTOS;
                    user.firstName = row.FirstName;
                    user.lastName = row.LastName;
                    user.appartment = row.Appartment;
                    user.house = row.House;
                    user.floor = row.floor;
                    user.cityId = row.CityId;
                    user.streetId = row.StreetId;
                    user.email = row.Email;
                    user.phone = row.Phone1;
                    user.defaultCreditCard = row.CreditCardRid;
                    if(CommonMethods.isNull(row.CreditCardRid)===false){
                        user.defaultCreditCardLast4 = row.CreditCardId.substring(row.CreditCardId.length - 5, 4);
                    }
                    else {
                        user.defaultCreditCardLast4 = undefined;
                    }
                    
                    if (CommonMethods.isNull(user.signedTOS)===true || user.signedTOS === '') {
                        user.signedTOS = false;
                    }
                    else{
                        user.signedTOS = true;
                    }

                })
                .on('error', function (error) {
                    Logger.error('Error while logging in in fron DataBase:',error);
                })
                .on('end', function (m) {
                    if (user === undefined || user ===null) {
                        Logger.error('No user found in DataBase !')
                        if (resultHandler !== undefined) {
                            resultHandler(resultMessage, user);
                        }
                    }
                    else {
                        Logger.debug('Found user:',user);
                        GetUserProfile(user, resultHandler, resultMessage);
                    }
                    Logger.info('finished db login');
                    client.close();
                });
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    this.GetCities = function(resultHandler) {
        Connect();
        query = _queryCompiler.CompileQuery(queries.GetCities,{});
        var cities = [];
        cities.push({Id:-1,name:'---בחר עיר---',regionId:-1});
        client.query(query)
            .on('row',function(row){
                cities.push({Id:row.CityId,name:row.CityName,regionId:row.RegionId});
            })
            .on('error', function(error){
                Logger.error('Error while getting cities fron DataBase:',error);
            })
            .on('end',function(m){
                Logger.debug("Sending cities to caller....");
                    if (resultHandler !== undefined && resultHandler !== null) {
                        resultHandler(cities);
                    }
                    Logger.debug('Cities retrieved from DB !');
                    client.close();
                });
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
     this.GetRegions = function(resultHandler) {
        Connect();
        query = _queryCompiler.CompileQuery(queries.GetRegions,{});
        var regions = [];
        client.query(query)
            .on('row',function(row){
                regions.push({Id:row.RegionId,name:row.RegionName});
            })
            .on('error', function(error){
                Logger.error('Error while getting regions fron DataBase:',error);
            })
            .on('end',function(m){
                Logger.debug("Sending regions to caller....");
                    if (resultHandler !== undefined && resultHandler !== null) {
                        resultHandler(regions);
                    }
                    Logger.debug('regions retrieved from DB !');
                    client.close();
                });
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    this.GetStreetsOfCity = function(cityId,resultHandler){
        Connect();
        var streets =[];
        query = _queryCompiler.CompileQuery(queries.GetStreetsOfCity,{cityId:cityId});
        client.query(query)
        .on('row',function(row){
            streets.push({Id:row.Id,Name:row.StreetName});
        })
        .on('error',function(error){
            Logger.error('Error while getting streets from DataBase:',error);
        })
        .on('end',function(m){
            Logger.debug('sending streets to caller...');
            if (resultHandler !== undefined && resultHandler !== null) {
                resultHandler(streets);
                Logger.debug('Streets were retrieved from data base');
                client.close();
            }
            });
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.GetPackageTypes = function(parentPackageId,resultHandler){
        Connect();
        var packageTypes = [];
        if (parentPackageId!==undefined && parentPackageId !== null) {
            query = _queryCompiler.CompileQuery(queries.GetPackageTypes,{parentPackageId:parentPackageId});
        }
        else{
            query = _queryCompiler.CompileQuery(queries.GetPackageTypes,{parentPackageId:'NULL'});
        }
        
        client.query(query)
        .on('row',function(row){
            packageTypes.push({Id:row.PackageTypeId
                              ,Name:row.PackageTypeName
                              ,Width:row.DefaultWidth
                              ,Height:row.DefaultHeight
                              ,Weight:row.DefaultWeight
                              ,Length:row.DefualtLength});
        })
        .on('error',function(error){
            Logger.error('Error while getting packageTypes from DataBase:',error);
        })
        .on('end',function(m){
            Logger.debug('sending packageTypes to caller...');
            if (resultHandler !== undefined && resultHandler !== null) {
                resultHandler(packageTypes);
                Logger.debug('packageTypes were retrieved from data base');
                client.close();
            }
            });
        
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.SubmitSendingRequest = function (sendingRequest, resultHandler) {
            var packagesXml =  xmlHelper.BuildPackagesXml(sendingRequest.request.Packages);
        Logger.debug(_moduleName,'Storing request in DB:',sendingRequest);
        var conn=EstablishConnection();
        query = _queryCompiler.CompileQuery(queries.InsertRequest,sendingRequest.request,
                            {'PickupDate':'Moment("{PickupDate}").format("YYYY-MM-DD")'});//,
                            //{'DeliveryDate':'Moment("{DeliveryDate}").format("YYYY-MM-DD")'});
        var session = undefined;
        conn.query(query,function(err,rows){
            if (err!==undefined && err!==null) {
                Logger.error('Error while inserting requets to DataBase:',err);
            }
            else{
             session = new Session(10);
             session.Id = rows[0][0].requestId;
             session.SendingRequest = sendingRequest;
             SavePackages(conn,session.Id,packagesXml,function(conn){conn.end();});
              if (resultHandler !== undefined && resultHandler !== null) {
                    resultHandler(session);
                }
                Logger.debug(_moduleName,'request was stores in data base');
            }
            });
    }
  this.SavePrice = function(providerUserId,sessionId,price,remark,resultHandler){
    var conn =EstablishConnection();
    var priceDetails = new Price(0,providerUserId,sessionId,price,remark);
    var query = _queryCompiler.CompileQuery(queries.InsertPrice,priceDetails);
    conn.query(query,function(err,rows){
            if (rows!== undefined && rows !== null) {
                
                priceDetails.Id = rows[0][0].PriceId;
                priceDetails.ProvidedTS = Moment(rows[0][0].PriceTS).local();
                priceDetails.ProvidedDate = Moment(price.ProvidedTS).local().format('DD/MM/YYYY');
                priceDetails.ProvidedTime = Moment(price.ProvidedTS).local().format('hh:mm:ss');
                if (resultHandler !== undefined && resultHandler !== null) {
                  resultHandler(priceDetails);
                }
            }
            conn.end();
        
        });
  }
  
  this.SaveDeal = function(session,price,resultHandler){
     
     var conn = EstablishConnection();
     
     Logger.debug('SD:Start, price:',price);
     var dealDetails = new DealDetails();
     Logger.debug('SD:DealDetails cerated, dd:',dealDetails);
     dealDetails.Request = session.SendingRequest;
     Logger.debug('SD:DealDetails rfq assigned, dd:',dealDetails);
     dealDetails.SenderUser = session.OwnerUserId;
     Logger.debug('SD:DealDetails sender user assigned, dd:',dealDetails);
     dealDetails.ProviderUser = price.UserId;
     Logger.debug('SD:DealDetails sender provider user assigned, dd:',dealDetails);
     dealDetails.SessionId = session.Id;
     Logger.debug('About to store deal:',dealDetails);
     var dealXml = xmlHelper.BuildDealXml(session.SendingRequest.request,price);
     Logger.debug('Deal xml:',dealXml);
     var query = _queryCompiler.CompileQuery(queries.InsertDeal,{RequestId:session.Id,Xml:dealXml});
     //_queryCompiler.CompileQuery(queries.InsertSenderContract,{RequestId:session.id,UserId:session.OwnerUserId,Price:price.Price,PriceId:price.Id});
     conn.query(query,function(err,rows){
                if(err!== undefined && err!== null){
                        Logger.error('Failed to save deal for session #',session.id,' ',err);
                    }
                else{
                    Logger.debug('Deal saved successfuly ...');
                    if (rows!== undefined && rows!== null) {
                        if (resultHandler !== undefined && resultHandler !== null) {
                            resultHandler(dealDetails);
                         }
                        dealDetails.Id = rows[0][0].DealId;
                        Logger.debug('Saving contracts of deal ',dealDetails.Id);
                        SaveContract({DealId:dealDetails.Id,
                                      UserId:session.OwnerUserId,
                                      ContractorTypeId:_self.SENDER_CONTRACTOR,
                                      Price:price.Price+price.Markup},conn,function(err,rows){
                                             SaveContract({DealId:dealDetails.Id,
                                                           UserId:price.UserId,
                                                           ContractorTypeId:_self.PROVIDER_CONTRACTOR,
                                                           Price:price.Price+price.Markup},conn,function(err,rows){
                                                                conn.end();
                                                          });
                                        })
                    }
                }
        });
     
     if (_self.dealCounter === undefined || _self.dealCounter === null) {
        _self.dealCounter =1;
     }
     else{
        _self.dealCounter++;
     }
  }
this.GetArchivedDeals = function(params,resultHandler){
        var conn = EstablishConnection();
        var query = _queryCompiler.CompileQuery(queries.Arc_GetDetails,params);
        var archivePackage = {};
        conn.query(query,function(err,rows){
                if (err!== undefined && err !== null) {
                    Logger.error('Failed to retrieve archived deal of params :',params,' error:',err);
                    archivePackage.success = false;
                    archivePackage.description = err;
                }
                else{
                     Moment.lang('he');
                    archivePackage.totalAmountOfRows = rows[0][0].AmountOfRows;
                    archivePackage.contracts = [];
                    for(var i = 0;i< rows[1].length;i++){
                        var dealRow = new DealDetails();
                        dealRow.id = rows[1][i].dealId;
                        dealRow.sessionId = rows[1][i].requestId;
                        dealRow.pickupCityId = rows[1][i].pickupCityId;
                        dealRow.pickupCityName = rows[1][i].pickupCityName;
                        dealRow.pickupStreetId = rows[1][i].pickupStreetId;
                        dealRow.pickupStreetName = rows[1][i].pickupStreetName;
                        dealRow.pickupHouse = rows[1][i].pickupHouse;
                        dealRow.pickupFloor = rows[1][i].pickupFloor;
                        dealRow.pickupAppartment = rows[1][i].pickupAppartment;
                        dealRow.pickupRemark = rows[1][i].pickupRemark;
                        
                        dealRow.deliveryCityId = rows[1][i].deliveryCityId;
                        dealRow.deliveryCityName = rows[1][i].deliveryCityName;
                        dealRow.deliveryStreetId = rows[1][i].deliveryStreetId;
                        dealRow.deliveryStreetName = rows[1][i].deliveryStreetName;
                        dealRow.deliveryHouse = rows[1][i].deliveryHouse;
                        dealRow.deliveryFloor = rows[1][i].deliveryFloor;
                        dealRow.deliveryAppartment = rows[1][i].deliveryAppartment;
                        dealRow.deliveryRemark = rows[1][i].deliveryRemark;
                        dealRow.pickupDate = Moment(rows[1][i].pickupDate).format('dddd, Do MMMM, YYYY');
                        dealRow.deliveryDate = Moment(rows[1][i].deliveryDate).format('dddd, Do MMMM, YYYY');
                        dealRow.pickupStartTime = rows[1][i].pickupStartTime;
                        dealRow.pickupEndTime = rows[1][i].pickupEndTime;
                        dealRow.deliveryStartTime = rows[1][i].deliveryStartTime;
                        dealRow.deliveryEndTime = rows[1][i].deliveryEndTime;
                        dealRow.price = rows[1][i].price;
                        dealRow.insuranseValue = rows[1][i].insuranceValue;
                        dealRow.DeliveryStatusId = rows[1][i].StatusId;
                        dealRow.DeliveryStatusName = rows[1][i].StatusName;
                        dealRow.contractorTypeId = rows[1][i].contractorTypeId;
                        dealRow.dealTS = Moment(rows[1][i].DealTS).format('llll');
                        
                        archivePackage.contracts.push(dealRow);
                        
                    }
                    archivePackage.success=true;
                    archivePackage.description='ok';
                    conn.end();
                    if (resultHandler !== undefined && resultHandler !== null) {
                     resultHandler(archivePackage);
                    }
                }
            });
    }
this.GetArchiveDealPackages = function(dealId,resultHandler){
        var conn = EstablishConnection();
        var query = _queryCompiler.CompileQuery(queries.Arc_GetDealPackages,{DealId:dealId});
        var archivePackage = {};
        Logger.debug('Archive: retrieving packages for deal #',dealId)
        conn.query(query,function(err,rows){
                 if (err!== undefined && err !== null) {
                    Logger.error('Failed to retrieve archived packages deal #',dealId,' error:',err);
                    archivePackage.success = false;
                    archivePackage.description = err;
                }
                else{
                    archivePackage.packages=[];
                    for (var i =0; i < rows[0].length;i++) {
                        packageRow = new Package();
                        packageRow.Length = rows[0][i].Length;
                        packageRow.Width = rows[0][i].Width;
                        packageRow.Height = rows[0][i].Height;
                        packageRow.Name = rows[0][i].PackageTypeName;
                        packageRow.InsuranceValue = rows[0][i].InsuranceValue;
                        packageRow.IsolationNeeded = ConvertBitToBool(rows[0][i].IsolationNeeded);
                        packageRow.Weight = rows[0][i].Weight;
                        packageRow.FreezeNeeded = ConvertBitToBool(rows[0][i].FreezeNeeded);
                        packageRow.Fragile = ConvertBitToBool(rows[0][i].Fragile);
                        archivePackage.packages.push(packageRow);
                    }
                    conn.end();
                    archivePackage.success=true;
                    archivePackage.description='ok';
                    if (resultHandler !== undefined && resultHandler !== null) {
                     resultHandler(archivePackage);
                    }
                }
            });
    }
this.UpsertInterest = function(data,errorHandler,resultHnadler){
        var conn = EstablishConnection();
        var interestResponse = {};
        var regions = xmlHelper.BuildRegionsXml(data.Regions);
        var packages = xmlHelper.BuildPackagesXml(data.Packages);
        var scheduler = xmlHelper.BuildSchedulerXml(data.Scheduler);
        Logger.debug('Regions XML :',regions);
        Logger.debug('Packages XML:',packages);
        Logger.debug('Scheduler XML:',scheduler);
        
        var query = _queryCompiler.CompileQuery(queries.UpsertInterest,{Id:data.Id,
                                                         InterestName:data.Name,
                                                         MaxInsuranceValue:data.MaxInsuranceValue,
                                                         HasFreeze:data.HasFreeze,
                                                         Fragile:data.Fragile,
                                                         HasIsolation:data.HasIsolation,
                                                         UserId:data.UserId,
                                                         Regions: regions,
                                                         Packages:packages,
                                                         Scheduler:scheduler},
                                                         {'Id':'({Id} === undefined || {Id} === null)?\'NULL\':{Id} ',
                                                         'HasFreeze':'{HasFreeze} === true? 1: 0',
                                                         'HasIsolation':'{HasIsolation} === true? 1: 0',
                                                         'Fragile':'{Fragile} === true? 1: 0'});
        Logger.debug('Upserting interest for user :',data.UserId);
        conn.query(query,function(err,rows){
                if (err !== undefined && err !== null) {
                    Logger.error('Failed to upsert interest',data);
                    interestResponse.success= false;
                    interestResponse.description = err;
                    if (errorHandler !== undefined && errorHandler !== null) {
                        errorHandler(interestResponse);
                    }
                }
                else{
                    interestResponse.success = true;
                    interestResponse.interestId = rows[0][0].InterestId;
                    Logger.debug()
                    if (resultHnadler !== undefined && resultHnadler !== null) {
                        resultHnadler(interestResponse);
                    }
                 conn.end();
                }
            });
        
    }
 this.GetInterests = function(userId,pageSize,pageId,errorHandler,resultHandler){
     var conn = EstablishConnection();
     var interestResponse = {};
     var query = _queryCompiler.CompileQuery(queries.Int_GetInterests,{UserId:userId,
                                                        PageId:((pageId=== undefined || pageId=== null)?'NULL':pageId),
                                                        PageSize:((pageSize=== undefined || pageSize=== null)?'NULL':pageSize)});
     conn.query(query,function(err,rows){
                if (err!== undefined && err!== null) {
                    Logger.error('Error retrieving interests for user ',userId,'.',err);
                }
                else{
                    interestResponse.success= true;
                    interestResponse.data = [];
                    rows[0].every(function(value,idx){
                            var interest = {};
                            interest.id = value.InterestId;
                            interest.name = value.InterestName;
                            interest.maxInsuranceValue = value.MaxInsuranceValue;
                            interest.hasFreeze = ConvertBitToBool(value.HasFreeze);
                            interest.hasIsolation = ConvertBitToBool(value.HasIsolation);
                            interest.fragile = ConvertBitToBool(value.Fragile);
                            interestResponse.data.push(interest);
                            return true;
                            
                        });
                    conn.end();
                    if (CommonMethods.isNull(resultHandler)===false) {
                        resultHandler(interestResponse);
                    }
                }
        });
        
 }
 this.GetInterestDetails = function(interestId,errorHandler,resultHandler){
     var conn =EstablishConnection();
     var interestResponse = {};
     var query = _queryCompiler.CompileQuery(queries.Int_GetInterestDetails,{InterestId:interestId});
     conn.query(query,function(err,rows){
            if (CommonMethods.isNull(err)=== true){
                var interest={}
                interest.InterestId = rows[0][0].InterestId;
                interest.InterestName = rows[0][0].InterestName;
                interest.MaxInsuranceValue = rows[0][0].MaxInsuranceValue;
                interest.HasFreeze = ConvertBitToBool(rows[0][0].HasFreeze);
                interest.HasIsolation = ConvertBitToBool(rows[0][0].HasIsolation);
                interest.Fragile = ConvertBitToBool(rows[0][0].Fragile);
                interest.Packages=[];
                interest.Regions = [];
                interest.Scheduler = [];
                 rows[1].every(function(value,idx){
                            var pac = {};
                            pac.PackageTypeId = value.PackageTypeId;
                            pac.MaxLength = value.MaxLength;
                            pac.MaxWidth = value.MaxWidth;
                            pac.MaxHeight = value.MaxHeight;
                            pac.MaxWeight = value.MaxWeight;
                            interest.Packages.push(pac);
                            return true;
                        });
                 rows[2].every(function(value,idx){
                        var reg ={};
                        reg.RegionId = value.RegionId;
                        interest.Regions.push(reg);
                        return true;
                    });
                 rows[3].every(function(value,idx){
                        var day = {};
                        day.Id = value.Day;
                        day.FromTime = Moment(value.FromTime,'HH:mm').format('HH:mm');
                        day.ToTime = Moment(value.ToTime,'HH:mm').format('HH:mm');
                        day.Remark = value.Remark;
                        interest.Scheduler.push(day);
                        return true;
                    });
                 conn.end();
                interestResponse.success=true;
                interestResponse.data = interest;
                if (CommonMethods.isNull(resultHandler)===false) {
                    resultHandler(interestResponse);
                }
                
            }
            else{
                if (CommonMethods.isNull(errorHandler)===false) {
                    interestResponse.success=false;
                    interestResponse.description='error';
                    errorHandler(err);
                }
            }
        });
 }
 this.DeleteInterest = function(interestId,errCallback,resultHandler){
        Connect();
        var query = _queryCompiler.CompileQuery(queries.Int_DeleteInterest,{InterestId:interestId});
        client.query(query)
        .on('error',function(error){
            if (CommonMethods.isNull(errCallback)===false) {
                        errCallback(error);
                    }})
        .on('row',function(value){
            })
        .on('end',function(m){
            if (CommonMethods.isNull(resultHandler)=== false) {
                        resultHandler();
                }
                client.close();
        });
    
        
    }
 this.GetInterestedProviders1 = function(requestId,errCallback,callback){
    var conn =EstablishConnection();
     var users = {};
     var query = _queryCompiler.CompileQuery(queries.GetRequestMatchedUsers,{RequestId:requestId});
     conn.query(query,function(err,rows){
            if (CommonMethods.isNull(err)===true) {
                rows[0].every(function(value,idx){
                        var user = {};
                        user.id = value.UserId;
                        users[user.id] = user;
                        return true;
                    });
                conn.end();
                if (CommonMethods.isNull(callback)=== false) {
                    callback(users);
                }
            }
        });
 }
 
 this.GetInterestedProviders = function(requestId,errCallback,resultHandler) {
        Connect();
        var query = _queryCompiler.CompileQuery(queries.GetRequestMatchedUsers,{RequestId:requestId});
       var users = {};
        client.query(query)
            .on('row',function(row){
                var user = {};
                        user.id = row.UserId;
                        users[user.id] = user;
            })
            .on('error', function(error){
                Logger.error('Error while getting matched users fron DataBase:',error);
            })
            .on('end',function(m){
                Logger.debug("Sending users to caller....");
                    if (resultHandler !== undefined && resultHandler !== null) {
                        resultHandler(users);
                    }
                    Logger.debug('Interest matched users retrieved from DB !');
                    client.close();
                });
    }
this.GetOrigins = function(errCallback,resultHandler){
        Connect();
        var query = _queryCompiler.CompileQuery(queries.GetOrigins);
        var origins = [];
        origins.push({id:-1,name:'הכל'});
        client.query(query)
        .on('error',function(error){
            if (CommonMethods.isNull(errCallback)===false) {
                        errCallback(error);
                    }})
        .on('row',function(value){
                        var origin = {};
                        origin.id = value.OriginId;
                        origin.name = value.OriginDescription;
                        origins.push(origin);
            })
        .on('end',function(m){
            if (CommonMethods.isNull(resultHandler)=== false) {
                        resultHandler(origins);
                }
                client.close();
        });
    
        
    }


this.Sub_IsUserNameUnique = function(data,errCallback,resultHandler){
        Connect();
        var query = _queryCompiler.CompileQuery(queries.Sub_IsUserNameUnique,{UserName:data});
        var result = true;
        client.query(query)
        .on('error',function(error){
            if (CommonMethods.isNull(errCallback)===false) {
                        errCallback(error);
                    }})
        .on('row',function(value){
                result = value.IsUnique === 'true'? true : false;    
            })
        .on('end',function(m){
            if (typeof(resultHandler)=== 'function') {
                        resultHandler(result);
                }
                client.close();
        });
    
        
    }


this.Sub_IsEmailUnique = function(data,errCallback,resultHandler){
        Connect();
        var query = _queryCompiler.CompileQuery(queries.Sub_IsEmailUnique,{Email:data});
        var result = true;
        client.query(query)
        .on('error',function(error){
            if (CommonMethods.isNull(errCallback)===false) {
                        errCallback(error);
                    }})
        .on('row',function(value){
                result = value.IsUnique === 'true'? true : false;    
            })
        .on('end',function(m){
            if (CommonMethods.isNull(resultHandler)=== false) {
                        resultHandler(result);
                }
                client.close();
        });
    
        
    }
this.Sub_IsUserUnique = function(data,errCallback,resultHandler){
    Connect();
        var query = _queryCompiler.CompileQuery(queries.Sub_IsUserUnique,data);
        var result = true;
        client.query(query)
        .on('error',function(error){
            if (CommonMethods.isNull(errCallback)===false) {
                        errCallback(error);
                    }})
        .on('row',function(value){
                result = value.IsUnique === 'true'? true : false;    
            })
        .on('end',function(m){
            if (typeof(resultHandler)=== 'function') {
                        resultHandler(result);
                }
                client.close();
        });
    }
this.Sub_SaveUser = function(data,errCallback,resultHandler){
    Connect();
        var query = _queryCompiler.CompileQuery(queries.Sub_SaveUser,data);
        var result = true;
        client.query(query)
        .on('error',function(error){
            if (CommonMethods.isNull(errCallback)===false) {
                        errCallback(error);
                    }})
        .on('row',function(value){
                result = value.UserId;    
            })
        .on('end',function(m){
            if (typeof(resultHandler)=== 'function') {
                        resultHandler(result);
                }
                client.close();
        });
    }
this.Sub_ApproveUser = function(data,errCallback,resultHandler){
     var conn =EstablishConnection();
     var query = _queryCompiler.CompileQuery(queries.Sub_ApproveUser,{UserId:data.UserId});
     conn.query(query,function(err,rows){
         if (CommonMethods.isNull(err) === true) {
             var result = rows[0][0].Result;
                conn.end();
                if (typeof(resultHandler)==='function') {
                    resultHandler(result);
                }
            }
            else{
             Logger.error('Failed to execute query:', query, ' reason:', err);
             if (typeof (errCallback) === 'function') {
                 errCallback(err);
             }
            }
        });
    }
this.TOS_UpdateSignature = function(userId,errCallback,resultHandler){
    var conn = EstablishConnection();
    var query = _queryCompiler.CompileQuery(queries.TOS_UpdateSignature,{UserId:userId});
    Logger.debug('Start update TOS signature of user:',userId);
    conn.query(query,function(err,rows){
            if (CommonMethods.isNull(err)===true) {
                conn.end();
                Logger.info('Signature of user:',userId,' updated succesfuly...');
                if(typeof(resultHandler)==='function'){
                    resultHandler({success:true});
                }
                else{
                    Logger.error('Failed to update TOS signature of user:',userId);
                }
 
            }
        });
    }
this.Delivery_UpdateStatus = function(data,errCallback,resultHandler){
    var conn = EstablishConnection();
    var query = _queryCompiler.CompileQuery(queries.Delivery_UpdateStatus,data);
    Logger.debug('Start update Delivery Status:',data);
    conn.query(query,function(err,rows){
            if (CommonMethods.isNull(err)===true) {
                conn.end();
                Logger.info('Update:',data,' updated succesfuly...');
                if(typeof(resultHandler)==='function'){
                    resultHandler({success:true});
                }
                else{
                    Logger.error('Failed to update TOS signature of user:',userId);
                }
 
            }
            else{
                if (typeof(errCallback)==='function') {
                    errCallback(err);
                }
            }
        });
}
this.GetCreditCardTypes = function (errCallback, resultHandler) {
    var conn = EstablishConnection();
    var query = _queryCompiler.CompileQuery(queries.GetCreditCardTypes, {});
    conn.query(query, function (err, rows) {
        if (CommonMethods.isNull(err) === true) {
            var creditCardTypes = [];
            rows[0].every(function (value, idx) {
                var ccType = { typeId: value.CreditCardTypeId, typeName: value.CreditCardTypeName };
                creditCardTypes.push(ccType);
                return true;
            });
            conn.end();
            if (typeof (resultHandler) === 'function') {
                resultHandler(creditCardTypes);
            }
        }
        else {
            Logger.error('Failed to execute query:', query, ' reason:', err);
        }
    });
}

this.GetConstraintsForPackageType = function (packageTypeId, errCallback, resultHandler) {
    var conn = EstablishConnection();
    var query = _queryCompiler.CompileQuery(queries.GetConstraintsForPackageType, { PackageTypeId: packageTypeId });
    conn.query(query, function (err, rows) {
        var result = { receiver: [], sender: [], courier: [] };
        if (CommonMethods.isNull(err) === true) {
            rows[0].every(function (value, idx) {

                var constraint = { name: value.ConstraintName, id: value.ConstraintId };
                switch (value.ConstrainOwner) {
                    case 'COURIER':
                        result.courier.push(constraint);
                        break;
                    case 'SENDER':
                        result.sender.push(constraint);
                        break;
                    case 'RECEIVER':
                        result.receiver.push(constraint)
                        break;
                }

                return true;
            });
            conn.end();
            if (typeof (resultHandler) === 'function') {
                resultHandler(result);
            }
        }
        else {
            Logger.error('Failed to execute query:', query, ' reason:', err);
        }
    });
}
    this.GetAllConstraints = function (errCallback, resultHandler) {
        var conn = EstablishConnection();
        var query = _queryCompiler.CompileQuery(queries.GetAllConstraints, {});
        conn.query(query, function (err, rows) {
            var constraints = {};
            
            if (CommonMethods.isNull(err) === true) {
                rows[0].every(function (value, idx) {
                    var packageType;
                    if(CommonMethods.isNull(constraints[value.PackageTypeId])===true){
                        packageType = {receiver:[],sender:[],courier:[]};
                        constraints[value.PackageTypeId] = packageType;

                    }
                    else{
                        packageType = constraints[value.PackageTypeId]
                    }

                    var constraint = { name: value.ConstraintName, id: value.ConstraintId };
                    switch (value.ConstraintOwner) {
                        case 'COURIER':
                            packageType.courier.push(constraint);
                            break;
                        case 'SENDER':
                            packageType.sender.push(constraint);
                            break;
                        case 'RECEIVER':
                            packageType.receiver.push(constraint)
                            break;
                    }

                    return true;
                });
                conn.end();
                if (typeof (resultHandler) === 'function') {
                    resultHandler(constraints);
                }
            }
            else {
                Logger.error('Failed to execute query:', query, ' reason:', err);
            }
        });
}

}


module.exports = db;