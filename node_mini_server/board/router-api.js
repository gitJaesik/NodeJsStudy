const express = require('express');
const common = require('./common');
var router = express.Router();
var conn = common.conn;

router.get('/articles', (req, res) => {
	// conn.query("SELECT * FROM articles", (err, rows, ))
});

router.post('/articles', common.bodyParser, (req,res) => {
	if (!req.session.user) {
		throw new Error("Not Authorized");
	}

	let error = {error:false, fields:{}};
});

module.exports = router;

