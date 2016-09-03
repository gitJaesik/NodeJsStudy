var http = require('http');
var fs = require('fs');
var port = process.env.port;

var server = http.createServer(onRequest);
server.listen(port);

function onRequest(request, response) {
    response.writeHead(200, {'Content-Type' : 'text/html'});
    var file = fs.readFileSync('index.html');
    response.write(file);
    //response.write('Hello nodejs');
    response.end();

}

