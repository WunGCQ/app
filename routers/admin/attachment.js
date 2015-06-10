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
var Person = require('../../apis/person');

var API = {
    person: Person,
    record: Record
};
function getAPIHolder(type) {
    return API[type] || API.record;
}
function makeUpdateCmds (req, attachments) {
    var data = {};
    var field = req._attachmentHolderField;
    if (req._attachmentHolderFieldType === 'array') {
        data.$pushAll = {};
        data.$pushAll[field] = [].concat(attachments);
    } else {
        data[field] = (attachments && attachments.length !== undefined ? attachments[0] : attachments);
    }
    return data;
}

function prepareAttachment(req) {
    var defer = Q.defer();
    var file = req.files && req.files.upfile;
    console.log('////upload files');
    console.log(file);
    var attachment;
    if (file) {
        attachment = {
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
            var download = Download({
                mode: '775',
                extract: true
            });
            for (var i = 0; i < filesCount; i++) {
                download = download.get(files[i]);
            }
            download.dest(req._attachmentPath)
                .run(function(err, files) {
                    var attachments = files.map(function(file) {
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
                    defer.resolve(attachments);
                });
        }
    }
    return defer.promise;
}

router.route('/')
    .get(function(req, res) {
        res.status(200).send(ueditorConf);
    })
    .post(function(req, res) {

        prepareAttachment(req)
            .then(function(attachments) {
                return Attachment.create(attachments);
            })
            .then(function(attachments) {
                console.log('// attachments');
                console.log(attachments);
                var result = {};
                if (attachments.length >= 1) {
                    result.list = attachments.map(function(a) {
                        return {
                            state: 'SUCCESS',
                            // url: a.url,
                            url: a.source, // use origin link for dev, use a.url in prod
                            source: a.source,
                            title: a.name
                        };
                    });
                } else {
                    result = {
                        url: attachments.url,
                        title: attachments.name,
                        original: attachments.originalname,
                        type: '.' + attachments.extension,
                        source: attachments.source,
                        size: attachments.size
                    };
                }
                result.state = 'SUCCESS';

                var _id = req.query._id || req.body._id;
                if (_id) {
                    var upData = makeUpdateCmds(req, attachments);
                    var APIHolder = getAPIHolder(req.query.target);
                    APIHolder.update(_id, upData)
                        .then(function(r) {
                            res.type('html').status(200).send(result);
                        }, function(err) {
                            res.type('html').status(200).send(err);
                        });
                } else {
                    res.type('html').status(200).send(result);
                }
            });
    });

module.exports = router;
