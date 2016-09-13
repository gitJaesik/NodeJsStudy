const http = require('http');
const fs = require('fs');

var static = {
	html: {		"upload.html" : fs.readFileSync(__dirname + "/upload.html")	}
};

var server = http.createServer(function(request, response) {
	var url = request.method + " " + request.url;

	if (url == "POST /upload") {
		var body = [];
		request.on('data', function(chunk) {
			body.push(chunk);
		}).on('end',function() {
			body = Buffer.concat(body).toString() + '\n';


			var wfs = fs.writeFile(__dirname + "/data", body,  {'flag':'a'}, (err)=> {
				if (err) throw err;
			});

		});
		response.setHeader("Location", "/upload");
		response.stateMessage = "Move permanetly";
		response.statusCode = 301;

	} else if (url == "GET /favicon.ico") {
		response.statusCode = 404;
		response.stateMessage = "Not Found";
		console.log("test");
	} else if (url == "GET /") {
		response.setHeader("Location", "/upload");
		response.stateMessage = "Moved permanetly";
		response.statusCode = 301;
	} else if (url == "GET /upload") {
		response.setHeader("Content-type", "text/html; charset=utf-8");
		
		var html = static.html["upload.html"];
		var message = "";
		//console.log(html);
		try {
			var data = fs.readFileSync(__dirname+"/data").toString();
			var dataArr = data.split('\n');
			//console.log(dataArr);
			for (var i in dataArr) {
				if (dataArr[i] != "")
				{
					/*
					response.write("<li>");
					response.write(dataArr[i]);
					response.write("</li>");
					*/
					message += "<li>" + dataArr[i].replace("message=", "<b>message:</b> ") + "</li>";
				}
			}
		}
		catch(err) {
			console.log(err);
		}
		html = html.toString().replace("{html}", message);
		response.statusCode = 200;
		response.statusMessage = "OK";
		response.setHeader("Content-type", "text/html; charset=utf-8");
		response.write(html);

	} else {
		response.statusCode = 404;
		response.stateMessage = "Not Found";
	}

	response.end();
});
server.listen(3000);