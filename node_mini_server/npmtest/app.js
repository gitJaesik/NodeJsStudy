const express = require('express');
const flickr = require('../nodeApiTest/flickrmodule');

const app = express();	// 서버를 만들어주는 것.. factory pattern으로 진행


// app.locals는 미리 있는 변수, app.settings만 변경하지 않으면 된다.

// views 설정
app.set('views', __dirname + '/html');

// view function을 ejs를 사용하는 것으로 변경
app.set('view engine', 'ejs');

// 세팅 추가하는 것
app.locals.title = "Flickr Photos";

console.log(app.locals);	// environment, views 등 확인하기

// 앞의 인자, 첫번째 패스, 두번째 인자
app.get('/', (req, res) => {
	// res.send('/');

	// 파일 명을 쓰면 바로 view폴더에서 찾는다. ex) html 폴더에서 찾는다 
	// res.render('index.ejs');

	flickr.getFlickrPhotos((photoArr) => {
		res.render('index.ejs', {
			title : app.locals.title,
			photoArr : photoArr
		});		
	});


	// append는 헤더를 주는 것
	// res.append('Content-Type', 'text/plain; charset=UTF-8');
	// res.append('Set-Cookie', 'key1=v1');
	// res.append('Set-Cookie', 'key2=v2');
	// res.send('hello world');
});

app.get('/large', (req,res) => {
	//res.send('/large');
	
	flickr.getFlickrPhotos((photoArr) => {
		res.render('index_large.ejs', {
			title : app.locals.title,
			photoArr : photoArr
		});		
	});
});

app.get('/json', (req, res) => {


	//res.send('/json');

	// flickr.getFlickrPhotos((photoArr) => {
	// 	res.json(photoArr);
	// });

	// flickr.getFlickrPhotos((photoArr) => {
	// 	res.render('index.ejs', photoArr);
	// });
});

app.listen(7777);
console.log('Server started at ' + new Date);

