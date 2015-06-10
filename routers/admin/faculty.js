'use strict';

var config = require('../../configs/config');
var jwt = require('express-jwt');
var router = require('express').Router();

var Person = require('../../apis/person');

router.route('/')
    .get(function(req, res) {
        Person.get(null, null, null, req.query)
            .then(function(list){
                res.render('admin/faculty', {
                    list: list
                });
            });
    });

module.exports = router;
