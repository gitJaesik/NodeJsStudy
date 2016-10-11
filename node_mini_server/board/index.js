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
		conn.query("select id, name, userid, role from users where userid=? and password=?", [
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

app.get('/logout', (req,res) => {
	delete req.session.member;
	res.redirect('/');
});

app.get('/', (req,res)=> {


	// var query = conn.query("SELECT * FROM users ORDER BY id DESC", function(err,rows){
/*
	var query = conn.query("SELECT users.id as usernumber, users.name, users.userid, " +
		"articles.id as articleid, articles.title, articles.text " + 
		"FROM users LEFT JOIN articles on articles.userid = users.id ORDER BY articles.id DESC;", function(err,rows){
        //console.log(rows); 
        // res.json(rows);
		res.render("index.ejs", {
			member : req.session.member,
			rows : rows,
			error : req.query.error
		});

    });
*/

	var promiseQueryArticleInfo = function() {
		return new Promise(function(resolve, reject) {
			var query = conn.query("SELECT users.id as usernumber, users.name, users.userid, " +
			"articles.id as articleid, articles.title, articles.text " + 
			"FROM users JOIN articles on articles.userid = users.id ORDER BY articles.id DESC;", function(err, rows) {
				if (err) {
					reject(Error(err));
				}
				else {
					resolve(rows);
				}
			});
		});
	};

	var promiseQueryUserInfo = function() {
		return new Promise(function(resolve, reject) {
			var query = conn.query("SELECT * FROM users ORDER BY id DESC", function(err, rows) {
				if (err) {
					reject(Error(err));
				}
				else {
					resolve(rows);
				}
			});
		});
	};

	Promise.all([promiseQueryArticleInfo(), promiseQueryUserInfo()]).then( function(values) {
		// console.log(values);
		res.render("index.ejs", {
			member : req.session.member,
			rowsForArticles : values[0],
			rowsForUsers : values[1],
			error : req.query.error
		});
	},function(err) {
		console.log(err);
	});

	/*
	promiseQueryUserInfo().then(
		function(val) {
			res.render("index.ejs", {
				member : req.session.member,
				rows : val,
				error : req.query.error
			});
		}
	);
	*/


});

app.get('/write', (req,res) => {
	if (!req.session.member) {
		res.redirect('/');
	}
	else {

		// 게시판 내용 저장하기 
		var old = null;
		if (req.session.flash) {
			old = req.session.flash;
			delete req.session.flash;
		}
		res.render("write.ejs", {
			member : req.session.member,
			error : req.query.error,
			old : old
		});
	}
});

app.post('/write', (req,res) => {
	if (!req.session.member) {
		res.redirect('/');
	}
	else {
		//console.log(req.body);
		if (!req.body.title || !req.body.content) {
			req.session.flash = {title:req.body.title, content:req.body.content};
			res.redirect('/write?error=write');
		}
		else {
			var query = conn.query("INSERT INTO articles (userid, title, text) VALUES (?, ?, ?)",
				[req.session.member.id, req.body.title, req.body.content], function(err, result) {
					if (err) {
						console.log(err);
						res.status(400).send('insert write value error');
					}
					else {
						res.redirect('/');
					}
				});
		}
	}

});

app.get('/update/:id', (req,res)=> {

	var promiseQueryArticleInfo = function() {
		return new Promise(function(resolve, reject) {
			var query = conn.query("SELECT users.id as usernumber, users.name, users.userid, " +
			"articles.id as articleid, articles.title, articles.text " + 
			"FROM users JOIN articles on articles.userid = users.id WHERE articles.id = (?) ORDER BY articles.id DESC;", req.params.id, function(err, rows) {
				if (err) {
					reject(Error(err));
				}
				else {
					resolve(rows);
				}
			});
		});
	};

	promiseQueryArticleInfo().then( (value) => {
		res.render("update.ejs", {
			member : req.session.member,
			error : req.query.error,
			rows : value[0]
		});}, (err)=> {
			if (err) {
				console.log(err);
			}
		});
	//res.status(400).send('test');
});

app.post('/update/:id', (req,res)=> {

	if (!req.session.member) {
		res.redirect('/');
	}
	else {
		//console.log(req.body);
		if (!req.body.title || !req.body.content) {
			req.session.flash = {title:req.body.title, content:req.body.content};
			res.redirect('/update?error=update');
		}
		else {
			console.log(req.body.title + ":" + req.body.content + ":" + req.params.id);
			var query = conn.query("UPDATE articles SET articles.title = (?), articles.text = (?) WHERE articles.id = (?)",
				[req.body.title, req.body.content, req.params.id], function(err, result) {
				if (err) {
					console.log(err);
				}else
				{
					res.redirect('/');
				}
			});
		}
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

// 미들웨어 사용할 때, 앞에 '/api'를 넣어주면 주소가 된다.
//app.use('/api', require('./router-api'));


app.listen(3000);