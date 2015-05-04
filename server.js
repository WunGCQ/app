;'use strict';

var config = require('./configs/config');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var app = express();
var router = require('./routers');



app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// preprocess for uploads
app.use(multer({dest: __dirname + '/statics/uploads/'}));

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE'); 
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, If-Modified-Since');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// view configs setup
app.set('views', './views');
app.set('view engine', 'jade');
app.set('view options', {layout: false});


/// static router;
/// TODO: routed via nginx instead!
app.use('/statics',express.static(__dirname + '/statics'));
app.use('/statics',express.static(__dirname + '/bower_components'));
app.use('/statics',express.static(__dirname + '/dist'));

// bussiness logic routes
//============================
// public pages
app.use('/', router.index);

// admin pages
app.use('/admin/editor.html', router.editor);


app.listen(config.server.port);
