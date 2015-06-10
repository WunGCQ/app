'use strict';
var config = require('../configs/config');
var jwt = require('express-jwt');
var router = require('express').Router();
var _ = require('underscore');

var Person = require('../apis/person');

router.param('personId', function(req, res, next, personId) {
    req.personId = personId;
    next();
});

router.route('/')
    .get(function(req, res) {
        Person.getPage(null, req.query)
            .then(function(resData) {
                return res.status(200).send(resData);
            }, function(resData) {
                return res.status(200).send(resData);
            });
    })
    .post(function(req, res) {
        var rawPerson = req.body;
        var resData = {};
        Person.create(rawPerson)
            .then(function(person) {
                resData.statusCode = 201;
                resData.data = person;
                return res.status(resData.statusCode).send(person);
            }, function(err) {
                resData.statusCode = 200;
                resData.err = err;
                return res.status(resData.statusCode).send(resData);
            });
    });

router.route('/:personId')
    .get(function(req, res) {
        var resData = {};
        resData.statusCode = 200;
        Person.get({
            _id: req.personId
        }).then(function(persons) {
            resData.data = persons[0];
            return res.status(resData.statusCode).send(resData);
        }, function(err) {
            resData.err = err;
            return res.status(resData.statusCode).send(resData);
        });
    })
    .put(function(req, res) {
        var person = req.body || {};
        var id = person._id;
        delete person._id;
        delete person.avatar;

        Person.update(id, person)
            .then(function(item) {
                res.status(200).send(item);
            }, function(err) {
                res.status(200).send(err);
            });
    })
    .delete(function(req, res) {
        var id = req.personId;
        Person.delete({
                _id: id
            })
            .then(function(person) {
                return res.status(200).send(person);
            }, function(err) {
                console.log(err);
                return res.status(200).send(err);
            });
    });

module.exports = router;
