/**
 * 依赖 axios
 */

define('newsManager', ['CONF', 'promise', 'util'], function(require, exports, module){
    var CONF = require('CONF');
    var Promise = require('promise');
    var Util = require('util');
    //===================================
    var manager = {};
    var cache = manager.cache = {};
    manager.get = function (id) {
        var defer = new Promise.Defer();
        var promise = defer.promise;
        var news = cache[id];

        if (news) {
            defer.resolve(news);
        } else {
            axios.get(CONF.API.news + '/' + id)
                .then(function(res){
                    news = res.data;
                    cache[id] = news;
                    defer.resolve(news);
                },function(err){
                    defer.reject(err);
                });
        }

        return promise;
    };
    manager.save = function (news) {
        var defer = new Promise.Defer();
        var promise = defer.promise;
        var id = news && news._id;
        var method = id ? 'put' : 'post';
        var url = CONF.API.news + '/' + (id || '');
        axios[method](url, news)
            .then(function(res){
                var news = res.data;
                cache[news._id] = news;
                defer.resolve(news);
            },function(err){
                defer.reject(err);
            });
        return promise;
    };
    manager.create = manager.save;
    manager.copy = function(news) {
        return Util.clone(news);
    };
    manager.updataLocal = function(news) {
        var id = news._id;
        if (cache[id]) cache[id] = news;
    };
    window.man = manager; // for dev
    window.Util = Util;
    return manager;
});