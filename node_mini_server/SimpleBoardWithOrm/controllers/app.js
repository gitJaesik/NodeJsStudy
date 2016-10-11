const express = require('express');
const models = require('../models'); // models 폴더의 index.js를 검색함
const bodyParser = require('body-parser').urlencoded({extended: true});
var router = express.Router();

router.get('/', (req,res) => {
	models.Article.findAll({
		include : [models.User]
	}).then(articles => {
		res.render('index', {
			articles : articles
		});
	});
});

router.get('/read/:id', (req,res)=> {
	models.Article.findById(req.params.id, {
		include: [models.User]
	}).then(article => {
		res.render('read', {
			article: article
		});
	});
});


router.get('/write', (req,res) => {
	res.render('write');
});

router.post('/write', bodyParser, (req,res) => {
	models.Article.create({
		title : req.body.title,
		text : req.body.text,
		user_id : 1
	}).then(article => {
		// article.id는 정상적으로 입력이 되면 orm에서 준다.
		res.redirect('/read/'+article.id);
	}).catch(err => {
		res.render('write-error', {
			errors : err.errors
		});
	});
});

router.get('/delete/:id', (req, res) => {
	models.Article.destroy({
		where : {
			id : req.params.id,
			user_id : 1
		}
	}).then(count => {
		res.redirect('/');
	});
});

module.exports = router;
