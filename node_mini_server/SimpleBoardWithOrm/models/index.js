const fs = require('fs');
const Seq = require('sequelize');
const config = require('../config');
const path = require('path');	// windows와 mac등 os별 호환성을 위한 모듈

var seq = new Seq(
	config.db.mysql.database,
	config.db.mysql.username,
	config.db.mysql.password, {
	define: {
		underscored : true
	}
});

// Define models
var models = {};

fs.readdirSync(path.normalize(__dirname)).forEach(fileName => {
	// Models의 디렉토리에 index.js 파일을 찾은 경우는 skip하기
	// node js의 변수 forEach는 continue가 return이다.
	if (path.normalize(__dirname + '/' + fileName) == path.normalize(__filename)) return;

	// 확장자를 제외한 이름 구하기
	let modelName = fileName.slice(0, -3);

	// models 변수에 넣기 // require을 하면서 바로 람다 함수 사용할 수 있도록 seq,Seq를 넘겨준다.
	// seq와 Seq가 넘어감으로써 타 모델에서 seq와 Seq를 다시 설정할 필요가 없다.
	models[modelName] = require(path.normalize(__dirname + '/' + fileName))(seq, Seq);
});

// Object.key는 map의 key 이름만 가져오게 한다.
Object.keys(models).forEach(modelName => {
	let Model = models[modelName];
	if (Model.relate) Model.relate(models);
});

// model의 seq 정보를 같이 저장하기
models.seq = seq;
models.Seq = Seq;

// 테스트용 데이터 만들기
// Sync with database
if (process.env.DROP) {
	seq.sync({force:true}).then(() => {
		console.log("synced");

		// dummies
		models.User.bulkCreate([{
			username : "admin",
			password : "1234"
		}, {
			username : "member",
			password : "1234"
		}]).then(() => {
			models.Article.bulkCreate([{
				user_id : 1,
				title : "title1",
				text : "text1"
			}, {
				user_id : 2,
				title : "title2",
				text : "text2"
			}]);
		});
	});
}

module.exports = models;