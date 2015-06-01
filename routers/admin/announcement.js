'use strict';

var config = require('../../configs/config');
var jwt = require('express-jwt');
var router = require('express').Router();

var Announcement = require('../../apis/announcement');

router.param('announcementId', function(req, res, next, announcementId) {
    req.newsId = announcementId;
    next();
});

router.route('/')
    .get(function(req, res) {
        Announcement.get(null, null, null, req.query)
            .then(function(announcementList) {
                res.render('admin/announcement', {
                    list: announcementList
                });
            });
    });

module.exports = router;
