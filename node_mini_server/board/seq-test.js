const Seq = require('sequelize');
const seq = new Seq('study', 'root', 'oooo');

var User = seq.define('user', {
	name: Seq.STRING,
	userid: Seq.STRING,
	password: Seq.STRING,
	role: Seq.ENUM("admin", "member")
});

var User = seq.define('article', {
	title: Seq.STRING,
	text: Seq.TEXT
});


// enum