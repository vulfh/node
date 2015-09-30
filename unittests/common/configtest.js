var assert = require('assert');
var Config = require('../../common/configuration/config.js');
var FakeLogger = require('../fakelogger.js');

var logger = new FakeLogger();

describe('Configutration',function(){
        describe('Check DEV configuration',function(){
                var config = new Config(logger,'DEV');
                it('should return empty string as db password',function(){
                        assert.equal(config.get('DATABASE','password'),'mizu');
                    });
                it('should return [root] as db user',function(){
                        assert.equal(config.get('DATABASE','user'),'vulf');
                    });
                it('should return [localhost] as db server',function(){
                        assert.equal(config.get('DATABASE','server'),'localhost');
                    });
            });
        describe('Check PROD configuration',function(){
                var config = new Config(logger,'PROD');
                it('should return [Lolik77] as db password',function(){
                        assert.equal(config.get('DATABASE','password'),'Lolik77');
                    });
                it('should return [root] as db user',function(){
                        assert.equal(config.get('DATABASE','user'),'root');
                    });
                it('should return [localhost] as db server',function(){
                        assert.equal(config.get('DATABASE','server'),'localhost');
                    });
            });
    });