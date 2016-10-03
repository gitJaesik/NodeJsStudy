const express = require('express');
const app = express();
const mysql = require('mysql');

var cookieParser = require('cookie-parser');
var session = require('express-session');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
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

app.use(express.static(__dirname + '/public'));

app.use([cookieParser(), session({secret:'jaesik'})]);

app.use((req,res,next) => {
	//console.log(req.cookies);
	//console.log(req.session);
	next();
});

app.post('/login', (req,res) => {
	if (!req.body.userid || !req.body.password) {
		res.status(422).end("Unprocessable Entity");
	}else{
		conn.query("select * from users where userid=? and password=?", [
			req.body.userid, req.body.password], (err, rows, field) => {
				if (err) {
					res.status(500).end();
				}

				if (rows.length == 0) {
					//res.status(401).end("Not Authorized");
					res.redirect('/?error=login');
				}
				else {
					req.session.member = rows[0];
					res.redirect('/');	
				}
				
				//req.settion
			});
	}
});

app.post('/logout', (req,res) => {
	delete req.session.member;
	res.redirect('/');
});

app.get('/', (req,res)=> {
	var query = conn.query("SELECT * FROM users ORDER BY id DESC", function(err,rows){
        //console.log(rows);
        // res.json(rows);
		res.render("index.ejs", {
			member : req.session.member,
			rows : rows,
			error : req.query.error
		});

    });
});

app.get('/write', (req,res) => {
	if (!req.session.member) {
		res.redirect('/');
	}
	else {
		res.render("write.ejs", {
			member : req.session.member,
			error : req.query.error
		});
	}
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