const fs = require('fs');
const Seq = require('sequelize');
const config = require('../config');
const path = require('path');

var seq = new Seq(
		config.db.mysql.database,
		config.db.mysql.username,
		config.db.mysql.password, {
	define: {
		underscored: true
	}
});

// Define models
var models = {};

fs.readdirSync(path.normalize(__dirname)).forEach(fileName => {
	if (path.normalize(__dirname+'/'+fileName) == path.normalize(__filename)) return;

	let modelName = fileName.slice(0, -3);
	models[modelName] = require(path.normalize(__dirname+'/'+fileName))(seq, Seq);
});

Object.keys(models).forEach(modelName => {
	let Model = models[modelName];
	if (Model.relate) Model.relate(models);
});

models.seq = seq;
models.Seq = Seq;

// Sync with database
if (process.env.DROP) {
	seq.sync({force: true}).then(() => {

		console.log("synced");

		// blog
		models.Blog.create({
			user_id: 'admin',
			password: '1234',
			name: 'jaesik',
			facebook_url: 'https://www.facebook.com/jaesik.phee',
			email: 'maguire1815@gmail.com',
			lat: 37.4814876,
			lang: 126.9500579,
			fax: '02-4477-6418',
			phone: '01044776418',
			contact_text: 'Hello!'

		// category
		}).then(blog => {
			return models.Category.bulkCreate([{
				name: '일상',
				blog_id: 1
			}, {
				name: '정보',
				blog_id: 1
			}]);

		// tag
		}).then(_ => {
			return models.Tag.bulkCreate([{
				name: '코딩',
				blog_id: 1
			}, {
				name: '창업',
				blog_id: 1
			}, {
				name: '음식',
				blog_id: 1
			}]);

		// contact
		}).then(_ => {
			return models.Contact.bulkCreate([{
				name: '피모씨',
				email: 'test@test.com',
				contents: '화이팅',
				blog_id: 1
			}, {
				name: '김모씨',
				email: 'test2@test.com',
				contents: '상태메세지입니다.',
				blog_id: 1
			}]);
		
		// file
		}).then(_ => {
			return models.File.bulkCreate([{
				name: 'image1.jpg',
				path: 'image1.jpg',
				type: 'image/jpg',
				blog_id: 1
			}, {
				name: 'image2.png',
				path: 'image2.png',
				type: 'image/png',
				blog_id: 1
			}]);

		// post
		}).then(_ => {
			models.Post.create({
				title: 'post1',
				contents: 'post1 contents',
				blog_id: 1
			}).then(post => {
				models.Comment.bulkCreate([{
					post_id: post.id,
					name: '문모씨',
					email: 'test@test.com',
					contents: '댓글요',
				}, {
					post_id: post.id,
					name: '김모씨',
					email: 'test2@test.com',
					contents: '댓글2요',
				}, {
					post_id: post.id,
					comment_id: 1,
					name: '김모씨',
					email: 'test2@test.com',
					contents: '1번 댓글에 대댓글요',
				}]);

				post.setFiles([1,2]);
				post.setTags([1,2]);
			});


			models.Post.create({
				title: 'post2',
				contents: 'post2 contents',
				blog_id: 1
			}).then(post => {
				models.Comment.bulkCreate([{
					post_id: post.id,
					name: '문2모씨',
					email: 'test@test.com',
					contents: '댓2글요',
				}, {
					post_id: post.id,
					name: '김2모씨',
					email: 'test2@test.com',
					contents: '댓2글2요',
				}, {
					post_id: post.id,
					comment_id: 5,
					name: '김2모씨',
					email: 'test2@test.com',
					contents: '2번 댓글에 대댓글요',
				}]);

				post.setFiles([2]);
				post.setTags([3]);
			});
		})
	});
}

models.Blog.findOne().then(blog=>{
	models.blog = blog;
	models.blogPlain = blog.get({plaint:true});
});

module.exports = models;