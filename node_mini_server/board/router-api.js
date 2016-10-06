const express = require('express');
const common = require('./common');
var router = express.Router();
var conn = common.conn;

router.get('/articles', (req, res) => {
	// conn.query("SELECT * FROM articles", (err, rows, ))
});


module.exports = router;

