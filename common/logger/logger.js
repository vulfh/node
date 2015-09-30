var winston = require('winston');

var logger = new (winston.Logger)({
 levels: {
    trace: 0,
    input: 1,
    verbose: 2,
    prompt: 3,
    debug: 4,
    info: 5,
    data: 6,
    help: 7,
    warn: 8,
    error: 9
  },
  colors: {
    trace: 'magenta',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    debug: 'blue',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    error: 'red'
  },

  exceptionHandlers: [
    new (winston.transports.Console)({ json: false, timestamp: true }),
    new winston.transports.File({ filename: __dirname + '/exceptions.log'})
  ],
  exitOnError: false
});
logger.StartConsoleLogging = function(level){
    logger.add(winston.transports.Console,{
    level: level,
    prettyPrint: true,
    colorize: true,
    silent: false,
    timestamp: false
});
}

logger.StartFileLogging = function(level,fileName){
    logger.add(winston.transports.File, {
    prettyPrint: false,
    level: level,
    silent: false,
    colorize: true,
    timestamp: true,
    filename:  fileName,
    maxsize: 400000,
    maxFiles: 100,
    json: false
});
}

module.exports = logger;