'use strict';

var config = require('../configs/config');
var jwt = require('express-jwt');
var router = require('express').Router();
var _ = require('underscore');

var Record = require('../apis/record');

router.param('recordId', function(req,res,next,recordId){
    req.recordId = recordId;
    next();
});

router.route('/')
    .get(function(req,res){
        var mode = +req.query.mode || 1;
        Record.get(null, null, null, req.query)
            .then(function(recordsList){
                if (mode === 1) {
                    res.status(200).send(recordsList);
                } else {
                    res.render(mode === 2 ? 'partials/records-list' : 'partials/records-archive',{
                        list: recordsList
                    });
                }
            });
    })
    .post(function(req,res){
        var record = req.body;
        record.lang = record.lang || res.locals.LANG.LANG_CODE;
        record.title = record.title || res.locals.LANG.news.title;
        record.category = record.category;
        Record.create(record)
            .then(function(record){
                return res.status(201).send(record);
            },function(err){
                return res.status(200).send(err);
            });
    });

router.route('/:recordId')
    .get(function(req,res){
        Record.get({
           _id: req.recordId 
        }).then(function(records){
            return res.status(200).send(records[0]);
        },function(err){
            return res.status(200).send(err);
        });
    })
    .put(function(req,res){
        var record = req.body || {};
        var id = record._id;
        delete record._id;

        Record.update(id, record)
            .then(function(item){
                res.status(200).send(item);
            },function(err){
                res.status(200).send(err);
            });
    })
    .delete(function(req,res){
        var id = req.recordId;
        Record.delete({_id: id})
            .then(function(record){
                return res.status(200).send(record);
            },function(err){
                console.log(err);
                return res.status(200).send(err);
            });
    });

module.exports = router;