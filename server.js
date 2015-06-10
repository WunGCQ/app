'use strict';

var config = require('./configs/config');
var db = require('./configs/db');
var express = require('express');
var bodyParser = require('body-parser');
var uploadHelper = require('./utils/upload-helper');
var app = express();
var router = require('./routers');
var I18N = require('./configs/lang');
var appMetasSetter = require('./configs/app-metas');

// connect database
db.start();

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// preprocess for uploads
app.use(uploadHelper.multer);
app.use(uploadHelper.expose);

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
app.set('view options', {
    layout: false
});

/// static router;
/// TODO: routed via nginx instead!
app.use('/statics', express.static(__dirname + '/statics'));
app.use('/statics', express.static(__dirname + '/bower_components'));
app.use('/statics', express.static(__dirname + '/dist'));

// bussiness logic routes
//============================
// lang, conf route
app.all('*', appMetasSetter);

// public pages
app.use('/', router.public.index);
app.use('/news', router.public.news);

app.use('/admin/attachments', router.admin.attachment);
// admin
app.use('/admin/editor', router.admin.editor);
app.use('/admin/home', router.admin.home);
app.use('/admin/news', router.admin.news);
app.use('/admin/announcements', router.admin.announcement);
app.use('/admin/faculty', router.admin.faculty);
app.use('/records', router.records);
app.use('/persons', router.persons);
//

app.listen(config.server.port);
