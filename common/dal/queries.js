 var queries = {
         GetUserData: "CALL shipping.GetUSerData ('{userName}','{password}');"
       , GetUserProfile: "CALL shipping.GetUserProfile({UserId});"
       , GetCities: "CALL shipping.GetCities();"
       ,GetStreetsOfCity: "CALL shipping.GetStreetsOfCity({cityId});"
       ,GetPackageTypes:"CALL shipping.GetPackageTypes ({parentPackageId});"
       ,InsertRequest:"CALL shipping.InsertRequest (@OwnerUserId:={OwnerUserId}\
                                                    ,@PickUpDate:='{PickupDate}'\
                                                     ,@PickupCityId:={PickupCity.Id}\
                                                     ,@PickupHouse:={PickupHouse.Number}\
                                                     ,@PickupStreetId:={PickupStreet.Id}\
                                                     ,@PickupFloor:='{PickupHouse.Floor}'\
                                                     ,@PickupAppartment:='{PickupHouse.Appartment}'\
                                                     ,@PickupStartTime:='{PickupStartTime}'\
                                                     ,@PickupEndTime:='{PickupEndTime}'\
                                                     ,@PickupRemark:='{PickupRemark}'\
                                                     ,@PickupContactPerson:='{PickupContactPerson}'\
                                                     ,@PickupCompany:='{PickupCompany}'\
                                                     ,@PickupPhone:='{PickupPhone}'\
                                                     ,@PickupEmail:='{PickupEmail}'\
                                                     ,@DeliveryCityId:={DeliveryCity.Id}\
                                                     ,@DeliveryStreetId:={DeliveryStreet.Id}\
                                                     ,@DeliveryDate:='{DeliveryDate}'\
                                                     ,@DeliveryFloor:='{DeliveryHouse.Floor}'\
                                                     ,@DeliveryAppartment:='{DeliveryHouse.Appartment}'\
                                                     ,@DeliveryRemark:='{DeliveryRemark}'\
                                                     ,@DeliveryStartTime:='{DeliveryStartTime}'\
                                                     ,@DeliveryEndTime:='{DeliveryEndTime}'\
                                                     ,@DeliveryContactPerson:='{DeliveryContactPerson}'\
                                                     ,@DeliveryCompany:='{DeliveryCompany}'\
                                                     ,@DeliveryPhone:='{DeliveryPhone}'\
                                                     ,@DeliveryEmail:='{DeliveryEmail}'\
                                                     ,@InsuranceValue:={InsuranseValue});"
    ,InsertPackagesOfRequest : "CALL shipping.InsertPackagesOfRequest (@requestId:={RequestId}\
                                                                      ,@packagesXml:='{Xml}')"
    ,InsertPrice : "CALL shipping.InsertPrice(@UserId:={UserId}\
                                              ,@RequestId:={SessionId}\
                                              ,@Price:={Price}\
                                              ,@Markup:={Markup}\
                                              ,@Remark:='{Remark}');"
    ,InsertDeal :"CALL shipping.InsertDeal(@RequestId:={RequestId}\
                                           ,@dealXml:='{Xml}');"
    ,InsertDealContract : "CALL shipping.InsertDealContract(@UserId:={UserId}\
                                                               ,@DealId:={DealId}\
                                                               ,@ContractorTypeId:={ContractorTypeId}\
                                                               ,@Price:={Price});"
    ,Arc_GetDetails : "CALL shipping.Arc_GetDeals(@UserID:={UserId}\
                                                    ,@StartTime:={StartTime}\
                                                    ,@EndTime:={EndTime}\
                                                    ,@PageSize:={PageSize}\
                                                    ,@PageId:={PageId}\
                                                    ,@ContractTypeId:={ContractTypeId}\
                                                    ,@DeliveryStatusOriginId:={DeliveryStatusOriginId}\
                                                    );"
    ,Arc_GetDealPackages :"CALL shipping.Arc_GetDealPackages(@DealId:={DealId});"
    ,GetRegions:"CALL shipping.GetRegions();"
    ,UpsertInterest:"CALL shipping.UpsertInterest(@InterestId:={Id}\
                                                 ,@InterestName:='{InterestName}'\
                                                 ,@MaxInsuranceValue:={MaxInsuranceValue}\
                                                 ,@HasFreeze:={HasFreeze}\
                                                 ,@HasIsolation:={HasIsolation}\
                                                 ,@Fragile:={Fragile}\
                                                 ,@UserId:={UserId}\
                                                 ,@RegionsXml:='{Regions}'\
                                                 ,@PackagesXml:='{Packages}'\
                                                 ,@SchedulerXml:='{Scheduler}');"
    ,Int_GetInterests:"CALL shipping.Int_GetInterests(@UserId:={UserId}\
                                                     ,@PageSize:={PageSize}\
                                                     ,@PageId:={PageId});"
    ,Int_GetInterestDetails:"CALL shipping.Int_GetInterestDetails(@pInterestId:={InterestId});"
    ,Int_DeleteInterest:"CALL shipping.Int_DeleteInterest(@InterestId:={InterestId})"
    ,GetRequestMatchedUsers:"call GetRequestMatchedUsers(@RequestId:={RequestId});"
    ,GetOrigins:"call GetAllOrigins();"
    ,Sub_IsUserNameUnique :"call Sub_IsUserUnique (@UserName:= '{UserName}'\
                                                      ,@Email:=NULL);"
    ,Sub_IsEmailUnique :"call shipping.Sub_IsUserUnique (@UserName:= NULL\
                                                      ,@Email:='{Email}');"
    ,Sub_SaveUser    :"call shipping.Sub_SaveUser (@UserName:='{UserName}'\
                                         ,@PasswordWord:='{Password}'\
                                         ,@RoleId:={RoleId}\
                                         ,@FirstName:='{FirstName}'\
                                         ,@LastName:='{LastName}'\
                                         ,@Email:='{Email}'\
                                         ,@Phone1:='{Phone1}'\
                                         ,@Phone2:='{Phone2}');"
    ,Sub_IsUserUnique:"call Sub_IsUserUnique(@UserName:='{UserName}'\
                                            ,@Email:='{Email}');"
    ,Sub_ApproveUser:"call shipping.Sub_ApproveUser(@UserId:={UserId});"
    ,TOS_UpdateSignature:"call shipping.TOS_UpdateSignature(@UserId:={UserId});"
    ,Delivery_UpdateStatus:"call shipping.delivery_updateStatus(@DealId:={DealId},\
                                                                @StatusId:={StatusId},\
                                                                @ResponsibleUserId:={UserId});"
    , GetCreditCardTypes: "call shipping.GetCreditCardTypes();"
    , GetUserDataByUserId: "CALL shipping.GetUserDataByUserId (@UserId:={userId});"
    , GetConstraintByPackageType: "CALL shipping.GetConstraints (@ConstraintOwner:=NULL,\
                                                                 @PackageTypeId:={PackagTypeId});"
    , GetAllConstraints: "CALL shipping.GetAllConstraints ();"
    };
    module.exports = queries;