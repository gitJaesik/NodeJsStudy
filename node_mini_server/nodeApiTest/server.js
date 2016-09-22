const http = require('http');
const fs = require('fs');
const flickrApi = require('./flickrmodule');

var static = {
	html : {"index.html" : fs.readFileSync(__dirname + "/index.html") }
};

var server = http.createServer(function(request, response){
	var url = request.method + " " + request.url;

	if (url == "something") {

	}
	else if (url == "GET /index") {
		response.setHeader("Content-type", "text/html; charset=utf-8");
		var html = static.html["index.html"];
		var message = [];

		flickrApi.getFlickrPhotos((photoArr)=> {
			for (var i = 0; i < photoArr.length; i++) {
				var photo = photoArr[i];
				message += "<img src=\"" + photo.medium + "\" alt=\"" + i + "\" height=\"42\" width=\"42\">"; 
				//message.push(i);
				//console.log(message);
			}
			html = html.toString().replace("{html}", message);
			response.statusCode = 200;
			response.statusMessage = "OK";
			response.write(html);
			response.end();

		});

		console.log(message);


//		console.log("test until now");
	} else if (url == "GET /") {
		response.setHeader("Location", "/index");
		response.stateMessage = "Moved permanetly";
		response.statusCode = 301;
		response.end();

	} else if (url == "GET /favicon.ico") {
		response.statusCode = 404;
		response.stateMessage = "Not Found";
		response.end();

	}
});
server.listen(3000);