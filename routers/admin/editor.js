'use strict';

var config = require('../../configs/config');
var ueditorConf = require('../../configs/ueditor');
var jwt = require('express-jwt');
var router = require('express').Router();

router.route('/')
    .get(function(req, res) {
        res.status(200).send(ueditorConf);
    })
    .post(function(req, res) {
        console.log(req.body);
        console.log(req.files);
        var file = req.files.upfile;
        var result = file ? {
            state: 'SUCCESS',
            //url: "\/ueditor\/php\/upload\/image\/20150416\/1429198496741037.png",
            url: '/statics/uploads/' + file.name,
            title: file.name,
            original: file.originalname,
            type: '.' + file.extension,
            size: file.size
        } : {
            state: 'SUCCESS',
            url: '/statics/uploads/flower.jpg'
        };
        return res.type('html').status(201).send(result);
    });

module.exports = router;
