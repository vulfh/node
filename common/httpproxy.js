var http = require('http');
var HttpProxy = function () {
}
HttpProxy.Post = function (host, port, path, data, err, callback) {
    var js = JSON.stringify(data);
    var options = {
        host: host,
        path: path,
        port: port,
        headers: { 'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(js)
        },
        method: 'POST'
    };
    try{
        var req = http.request(options, function onResponse(response) {
            var responseStr = '';
            response.on('data', function (chunk) {
                responseStr += chunk;
            });
            response.on('end', function () {
                try {
                    var responseObj;
                    if (typeof (responseStr) === 'string') {
                        responseObj = JSON.parse(responseStr);
                    }
                    else if (typeof (responseStr) === 'object') {
                        responseObj = responseStr;
                    }
                    callback(responseObj);
                }
                catch (error) {
                    err('Failed to convert [' + responseStr + '] to object !');
                }
            });
        });
    
        req.write(js);
        req.end();
    }
    catch(e){
        console.log('ERROR:'+path+'||'+data+' description:'+e.toString());         
    }
}

HttpProxy.Get = function (host, port, path, data, err, callback) {
    var options = {
        host: host,
        port: port,
        path: path + '?' + data
    };
    var responseStr = '';
    try{
        var req = http.request(options, function onCallback(response) {
            response.on('data', function (chunk) {
                responseStr += chunk;
            });
            response.on('end', function () {
                try {
                    var responseObj;
                    if (typeof (responseStr) === 'string') {
                        responseObj = JSON.parse(responseStr);
                    }
                    else if (typeof (responseStr) === 'object') {
                        responseObj = responseStr;
                    }
                    callback(responseObj);
                }
                catch (error) {
                    err('Failed to convert [' + responseStr + '] to object !');
                }
            });
        });
        req.end();
    }
    catch(e){
        console.log('ERROR:'+path+'?'+data+' description:'+e.toString());     
    }
}

module.exports = HttpProxy;