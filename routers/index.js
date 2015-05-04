;'use strict';

var config = require('../configs/config');
var ueditorConf = require('../configs/ueditor');
var jwt = require('express-jwt');
var router = require('express').Router();

router.route('/')
    .get(function(req,res){
        res.render('public/index',{
            name: 'ueditor demo'
        });
    });


module.exports = router;