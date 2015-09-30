var assert = require('assert');
var FakeLogger = require('../fakelogger.js');
var QueryCompiler = require('../../common/template.js');

var logger = new FakeLogger();

describe('Template',function(){
    assert.equal(typeof(QueryCompiler.CompilerBuilder),'function');
    var templateCompilerBuilder = new QueryCompiler.CompilerBuilder().createBuilder();
    
        describe('Check template generation with SQL injection protection',function(){
                var queryCompiler = templateCompilerBuilder.create(logger)
                                                            .get();
                it('should return "select 1 from shipping where a=o\'\'k"',
                   function(){
                        var query = queryCompiler.CompileQuery('select 1 from shipping where a={data}',{data:"o'k"});
                        assert.equal(query,"select 1 from shipping where a=o''k");
                   });
                
            });
        describe('Check template generation WITHOUT SQL injection protection',function(){
                var queryCompiler = templateCompilerBuilder.create(logger)
                                    .disableSqlInjection()
                                    .get();
                it('should return "select 1 from shipping where a=o\'k"',
                   function(){
                        var query = queryCompiler.CompileQuery('select 1 from shipping where a={data}',{data:"o'k"});
                        assert.equal(query,"select 1 from shipping where a=o'k");
                   });
                
            });
    });