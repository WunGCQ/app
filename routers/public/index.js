'use strict';

var config = require('../../configs/config');
var ueditorConf = require('../../configs/ueditor');
var jwt = require('express-jwt');
var News = require('../../apis/news');
var router = require('express').Router();

router.route('/')
    .get(function(req,res){
        News.get({
            status: 'sticked',
            $where: 'this.images.length > 0'
        }, '-content', {
            limit: 4
        }).then(function(list) {
            res.render('public/index',{
                name: 'ueditor demo',
                list : JSON.stringify(list)
            });
        });

    });
router.route('/news_pic/')
    .get(function(req,res){

    });


module.exports = router;