'use strict';

var config = require('../../configs/config');
var jwt = require('express-jwt');
var router = require('express').Router();

var News = require('../../apis/news');

router.route('/')
    .get(function(req, res) {
        var mode = +req.query.mode || 1;

        News.get(null, null, null, req.query)
            .then(function(newsList) {
                if (mode === 2) {
                    res.status(200).send(newsList);
                } else {
                    res.render(mode === 1 ? 'admin/news' : 'partials/records-list', {
                        list: newsList
                    });
                }
            });
    });

module.exports = router;
