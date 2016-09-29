const express = require('express');
const app = express();
const mysql = require('mysql');

var bodyparser = require('body-parser');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
	extended: true
}));

app.set('view engine', 'ejs');
app.set('views', __dirname+'/html');

// const는 수정 x, var는 옛날 것, let은 블록 안에서 사용하면 사용 후 바로 소멸됨
let conn = mysql.createConnection({
	host 		: 'localhost',
	user 		: 'root',
	password 	: 'oooo',
	database	: 'study'
});

conn.connect();
app.get('/', (req,res)=> {
	var query = conn.query("SELECT * FROM users ORDER BY id DESC", function(err,rows){
        //console.log(rows);
        // res.json(rows);
		res.render("index.ejs", {
			rows : rows
		});

    });
});

app.post('/', (req,res)=> {
	//console.log(req.body["inputusername"]);
	var inputUsername = req.body["inputusername"];
	var query = conn.query("INSERT INTO users(name) VALUES (?)", inputUsername, function(err, result) {
		if (err) {
			//res.send("insert user error");
			res.status(400).send('insert user value error');
		}
		else {
			//console.log(err);
			//console.log(result);
			res.redirect('/');
		}
	});
	//res.send('POST requeest to homepage');

    // var bodyStr = '';
    // req.on("data",function(chunk){
    //     bodyStr += chunk.toString();
    // });
    // req.on("end",function(){
    //     res.send(bodyStr);
    // });
});

app.listen(3000);