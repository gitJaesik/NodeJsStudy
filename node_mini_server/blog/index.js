const path = require('path');
const config = require(path.join(__dirname, 'config'));
const express = require('express');
const app = express();

/** configuration **/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.locals.app = config.app;


/** middlewares **/
app.use(require(path.join(__dirname,'controllers/logger')));
app.use(express.static(path.join(__dirname,'public')));
app.use(require('serve-favicon')(path.join(__dirname, config.app.favicon)));
app.use(require('morgan')('dev'));
app.use(require('express-session')({secret: config['session-secret']}));

/** routers **/
app.use((req,res,next)=> {
	res.locals.req = {
		user : req.session.user || null,
		url : req.originalUrl,
		nav : req.path.split('/')[1],
		path : req.path,
		query : req.query
	};
	next();
});
app.use(require(path.join(__dirname, 'controllers/blog-router')));
app.use('/admin', require(path.join(__dirname, 'controllers/admin-router')));

app.use(require(path.join(__dirname,'controllers/not-found')));
app.use(require(path.join(__dirname,'controllers/error')));

app.listen(config.port);