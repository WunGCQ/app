'use strict';

var config = require('../../configs/config');
var jwt = require('express-jwt');
var router = require('express').Router();

var News = require('../../apis/news');

router.param('newsId', function(req,res,next,newsId){
    req.newsId = newsId;
    next();
});


router.route('/:newsId')
    .get(function(req,res){
        var news = {};
        var fields = '_id title category createdAt';
        var conds = {
            //status: 'published'
        };
        var opts = {
            limit: 10
        };
        News.get({
            _id: req.newsId
        }).then(function(res){
            news = res[0];
        }).then(function(){
            return News.get(conds, fields, opts);
        }).then(function(list){
            res.render('public/news',{
                news: news || {},
                list: list
            });
        },function(err){
            res.render('public/news',{
                news: {}
            });
        });
    });


module.exports = router;