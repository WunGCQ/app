'use strict';

var config = require('../../configs/config');
var ueditorConf = require('../../configs/ueditor');
var jwt = require('express-jwt');
var router = require('express').Router();
var Attachment = require('../../apis/attachment');
var Download = require('download');
var Path = require('path');
var Q = require('q');
var Record = require('../../apis/record');

function prepareAttachment (req) {
    var defer = Q.defer();
    var file = req.files && req.files.upfile;
    var attachment;
    if (file) {
        attachment ={
            originalName: file.originalname,
            name: file.name,
            extension: Path.extname(file.name),
            mimetype: file.mimetype,
            size: file.size,
            dir: req._attachmentDest,
            path: file.path,
            url: req._attachmentDest + file.name,
            source: file.url || ''
        };
        defer.resolve(attachment);
    } else {
        var files = req.body['upfile[]'];
        if (files) {
            files = [].concat(files);
            var filesCount = files.length;
            var download = Download({mode: '775', extract: true});
            for (var i = 0; i < filesCount; i++) {
                download = download.get(files[i]);
            }
            download.dest(req._attachmentPath)
                .run(function(err, files){
                    var attachments = files.map(function(file){
                        var name = file.history[0];
                        var path = file.history[1];
                        var attachment = {
                            originalName: name,
                            name: name,
                            extension: Path.extname(name),
                            path: path,
                            dir: req._attachmentDest,
                            url: req._attachmentDest + name,
                            source: file.url
                        };
                        return attachment;
                    });
                    defer.resolve(attachments.length > 1 ? attachments : attachments[0]);
                });
        }
    }
    return defer.promise;
}

router.route('/')
    .get(function(req,res){
        res.status(200).send(ueditorConf);
    })
    .post(function(req,res){

        prepareAttachment(req)
            .then(function(attachment){
                return Attachment.create(attachment);
            })
            .then(function(attachment){
                var result = {};
                if (attachment.length > 1) {
                    result.list = attachment.map(function(a){
                        return {
                            state: 'SUCCESS',
                            url: a.url,
                            source: a.source,
                            title: a.name
                        };
                    });
                } else {
                    result = {
                        url: attachment.url,
                        title: attachment.name,
                        original: attachment.originalname,
                        type: '.' + attachment.extension,
                        size: attachment.size
                    } ;
                }
                result.state = 'SUCCESS';

                var _id = req.query._id;
                if (_id) {
                    var data = {$pushAll: {}};
                    data.$pushAll[req._attachmentType] = [].concat(attachment);
                    Record.update(_id, data) 
                        .then(function(record){
                            res.type('html').status(200).send(result);
                        },function(err){
                            res.type('html').status(200).send(err);
                        });
                } else {
                    res.type('html').status(200).send(result);
                }
            });
    });

module.exports = router;