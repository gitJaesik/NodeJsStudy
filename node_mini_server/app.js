const http = require('http');
const fs = require('fs');

var server = http.createServer(function(request, response) {

    var method = request.method;

    //console.log("test");

    if (method == "POST") {
        // 숙제에서 생략
    } else if (method == "GET") {
        // fs.read ...
        // response.write ...
        // response.end()
        console.log("hi3");
		var fileHeader = fs.readFileSync('header.html');
    	var fileData = fs.readFileSync('data.dat');
    	var fileFooter = fs.fs.readFileSync(path, options);nc('footer.html');
	    response.write(fileHeader);
    	response.write(fileData);
    	response.write(fileFooter);

	    response.end();

    } else {
        // 숙제에서 생략
        console.log("hi2");
    }
});
server.listen(3000);