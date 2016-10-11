const config = require('./config');
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use([
	express.static(__dirname + '/static'),
	require('express-session')({secret:'jaesik'}),
	require(__dirname + '/controllers/app'),
	require(__dirname + '/controllers/not-found'),
	require(__dirname + '/controllers/error')
	]);

// controllers/app에서 라우터 처리가 안된 경우 not-found로 가도록 설정

app.listen(config.port);
