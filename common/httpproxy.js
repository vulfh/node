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
            'Content-Length': js.length
        },
        method: 'POST'
    };
    var req = http.request(options, function onResponse(response) {
        var responseStr = '';
        response.on('data', function (chunk) {
            responseStr += chunk;
        });
        response.on('end', function () {
            try {
                var responseObj = JSON.parse(responseStr);
                debugger;
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

HttpProxy.Get = function (host, port, path, data, err, callback) {
    var options = {
        host: host,
        port: port,
        path: path + '?' + data
    };
    var responseStr = '';
    var req = http.request(options, function onCallback(response) {
        response.on('data', function (chunk) {
            responseStr += chunk;
        });
        response.on('end', function () {
            try {
                var responseObj = JSON.parse(responseStr);
                callback(responseObj);
            }
            catch (error) {
                err('Failed to convert [' + responseStr + '] to object !');
            }
        });
    });
    req.end();
}

module.exports = HttpProxy;