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
    .get(function(req,res){
        News.get()
            .then(function(newsList){
                res.render('admin/news',{
                    newsList: newsList
                });
            });
    })
    .post(function(req,res){
        var news = req.body;
        news.lang = news.lang || res.locals.LANG.LANG_CODE;
        news.title = news.title || res.locals.LANG.news.title;
        News.create(news)
            .then(function(news){
                return res.status(201).send(news);
            },function(err){
                return res.status(200).send(err);
            });
    });

router.route('/:newsId')
    .get(function(req,res){
        News.get({
           _id: req.newsId 
        }).then(function(news){
            return res.status(200).send(news[0]);
        },function(err){
            return res.status(200).send(err);
        });
    })
    .put(function(req,res){
       var news = req.body;
       var id = news._id;
       delete news._id;
       News.update(id, news)
        .then(function(item){
            res.status(200).send(item);
        },function(err){
            res.status(200).send(err);
        });
    });



module.exports = router;