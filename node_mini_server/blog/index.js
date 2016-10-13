const path = require('path');
const config = require(path.join(__dirname, 'config'));
const express = require('express');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(require(path.join(__dirname,'controllers/logger')));
app.use('/public', express.static(path.join(__dirname,'public')));
app.use(require('serve-favicon')(path.join(__dirname, 'public', config.favicon)));
app.use(require('morgan')('combined'));
app.use(require('express-session')({secret: config['session-secret']}));

app.use(require(path.join(__dirname, 'controllers/blog-router')));
app.use('/admin', require(path.join(__dirname, 'controllers/admin-router')));

app.use(require(path.join(__dirname,'controllers/not-found')));
app.use(require(path.join(__dirname,'controllers/error')));

app.listen(config.port);