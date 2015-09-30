var assert = require('assert');
var UserPermission = require('../../common/user/userpermission.js');
describe('UserPermission',function(){
        describe('Check Permission By Mask',function(){
                var up = new UserPermission(UserPermission.Regular,false);
                it('should return true on 1',function(){
                    assert.equal(up.CheckPermissionByMask(1),true);
                    });
                
            });
    });

