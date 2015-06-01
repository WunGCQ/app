'use strict';

var config = require('../../configs/config');
var jwt = require('express-jwt');
var router = require('express').Router();

router.route('/')
    .get(function(req, res) {
        res.render('admin/home', {
        });
    });

module.exports = router;
