'use strict';

var config = require('../../configs/config');
var ueditorConf = require('../../configs/ueditor');
var jwt = require('express-jwt');
var router = require('express').Router();

var News = require('../../apis/news');

router.param('newsId', function(req,res,next,newsId){
    req.newsId = newsId;
    next();
});

router.route('/')
    .post(function(req,res){
        var record = req.body;
        record.lang = record.lang || res.locals.LANG.LANG_CODE;
        record.title = record.title || res.locals.LANG.news.title;
        record.category = record.category || '';
        record.group = record.group || '';
        News.create(record)
            .then(function(record){
                return res.status(201).send(record);
            },function(err){
                return res.status(200).send(err);
            });
    });

module.exports = router;