const models = require('../models');
const express = require('express');
var router = express.Router();

// 새로운 query가 들어왔을 때 DB를 사용하게 하기
router.use((req,res,next) => {
	// find blog 1
	models.Blog.findOne({
		// include 는 연결된 부분과의 정보를 보여준다.
		// join
		include: [
			models.Blog.associations.aboutPost,
			models.Blog.associations.logoFile,
			models.Category
		]
	}).then(blog => {
		res.blog = blog;
		res.locals.blog = blog.get({plain:true});

		// json 구조 확인을 위한 부분
		//res.json(res.local.blog);
		next();
	}).catch(err=> {
		console.log(err);
	});
});


router.get('/', (req,res) => {
	// 하기 쿼리를 많이 사용하면 scope를 사용하면 된다.

	let page = parseInt(req.query.page);
	page = (isNaN(page) || page < 1) ? 1 : page;
	 
	let block = 5;

	res.blog.getPosts({
		include : [
			models.Category,
			{
				model : models.File,
				where : {
					type: {
						$like: 'image/%'
					}
				}
			}
		],
		offset : (page - 1) * block,
		limit : block, // 한개만 
		order: [['id', 'desc'] /*, ['date', 'asc'], models.seq.fn('max',models.seq.col('hit'))*/ ]
	}).then(posts => {

		res.render('blog/home',{
			posts : posts
		});
	});
	// $like 대신 REGEX를 사용하여도 된다.


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