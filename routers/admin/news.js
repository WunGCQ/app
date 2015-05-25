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
        var mode = +req.query.mode || 1;
        
        News.get(null, null, null, req.query)
            .then(function(newsList){
                if (mode === 2) {
                    res.status(200).send(newsList);
                } else {
                    res.render(mode === 1 ? 'admin/news' : 'partials/record-list',{
                        list: newsList
                    });
                }
            });
    })
    .post(function(req,res){
        var news = req.body;
        news.lang = news.lang || res.locals.LANG.LANG_CODE;
        news.title = news.title || res.locals.LANG.news.title;
        news.category = 'news';
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
        var data = {
            title: news.title,
            content: news.content
        };
        News.update(id, data)
            .then(function(item){
                res.status(200).send(item);
            },function(err){
                res.status(200).send(err);
            });
    })
    .delete(function(req,res){
        var id = req.newsId;
        News.delete({_id: id})
            .then(function(news){
                console.log(news);
                return res.status(200).send(news);
            },function(err){
                console.log(err);
                return res.status(200).send(err);
            });
    });



module.exports = router;