const express = require('express');
var router = express.Router();

router.get('/', (req,res) => {
	res.render('blog/home');
});

router.get('/about', (req,res) => {
	res.render('blog/about');
});

router.get('/photos', (req,res) => {
	res.render('blog/photos');
});

router.get('/archives', (req,res) => {
	res.render('blog/archives');
});

router.get('/contact', (req,res) => {
	res.render('blog/contact');
});



module.exports = router;