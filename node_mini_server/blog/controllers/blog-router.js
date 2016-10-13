const express = require('express');
var router = express.Router();

router.get('/', (req,res) => {
	res.send('blog router');
});

module.exports = router;