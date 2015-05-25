/**
 * 依赖 axios
 */

define('recordManager', ['CONF', 'promise', 'util'], function(require, exports, module){
    var CONF = require('CONF');
    var Promise = require('promise');
    var Util = require('util');
    //===================================
    var manager = {};
    var records = manager.records = {};
    var pages = manager.pages = {};
    manager.getRecord = function (id) {
        var defer = new Promise.Defer();
        var promise = defer.promise;
        var record = records[id];

        if (record) {
            defer.resolve(record);
        } else {
            axios.get(CONF.API.record + '/' + id)
                .then(function(res){
                    record = res.data;
                    records[id] = record;
                    defer.resolve(record);
                },function(err){
                    defer.reject(err);
                });
        }

        return promise;
    };
    manager.deleteRecord = function(record){
        var defer = new Promise.Defer();
        record = typeof record === 'object' ? record._id : record;
        axios.delete(CONF.API.record + '/' + record)
            .then(function(res){
                console.log(res);
                manager.deleteLocalRecord(record);
                defer.resolve(res.data);
            }, function(err){
                defer.reject(err);
            });

        return defer.promise;
    };
    manager.saveRecord = function (record) {
        var defer = new Promise.Defer();
        var promise = defer.promise;
        var id = record && record._id;
        var method = id ? 'put' : 'post';
        var url = CONF.API.record + '/' + (id || '');
        axios[method](url, record)
            .then(function(res){
                var record = res.data;
                records[id] = record;
                defer.resolve(record);
            },function(err){
                defer.reject(err);
            });
        return promise;
    };
    manager.createRecrod = manager.saveRecord;
    manager.copyRecord = function(record) {
        return Util.clone(record);
    };
    manager.updataLocalRecord = function(record) {
        var id = record._id;
        if (records[id]) records[id] = record;
    };
    manager.deleteLocalRecord = function(record){
        record = typeof record === 'object' ? record._id : record;
        delete records[record];
    };
    manager.archive = function(){

    };
    manager.getPage = function(page, shouldArchive) {
        //axios.get()
    };
    window.man = manager; // for dev
    window.Util = Util;
    return manager;
});