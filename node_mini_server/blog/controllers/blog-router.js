const models = require('../models');
const express = require('express');
var router = express.Router();

router.use((req,res,next) => {
	// find blog 1
	models.Blog.findOne({
		include: [
			models.Blog.associations.aboutPost,
			models.Blog.associations.logoFile
		]
	}).then(blog => {
		res.blog = blog;
		res.locals.blog = blog.get({plain:true});
		next();
	});
});

router.get('/', (req,res) => {
	let block = 1,
			page = parseInt(req.query.page);

	page = (isNaN(page) || page < 1) ? 1: page;

	Promise.all([
		res.blog.getPosts({
			include: [
				models.Category,
				{
					model: models.File,
					where: {
						type: {
							$like: 'image/%'
						}
					}
				}
			],
			offset: (page-1)*block,
			limit: block,
			order: [['id','desc']]
		}),
		
		res.blog.countPosts()
	
	]).then(result => {

		let posts = result[0], count = result[1];
		posts.page = {
			entryTotal: count,
			total: Math.floor(count/block) + (count%block==0 ? 0 : 1),
			current: page
		};

		res.render('blog/home', {
			posts: posts
		});
	});
});

router.get('/about', (req,res) => {
	res.render('blog/about');
});

router.get('/contact', (req,res) => {
	res.render('blog/contact');
});

router.get('/photos', (req,res) => {
	res.render('blog/photos');
});

router.get('/archives', (req,res) => {
	res.render('blog/archives');
});

module.exports = router;