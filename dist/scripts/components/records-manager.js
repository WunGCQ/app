/**
 * 依赖 axios
 */

define('RecordsManager', ['CONF', 'promise', 'utils'], function(require, exports, module){
    var Promise = require('promise');
    var Util = require('utils');
    //===================================
    /**
     * RecordManager
     * @param {[type]} APIS [description]
     */
    function RecordsManager(conf) {
        this.conf = conf;
        this.records = {};
        this.categories = {};
    }
    function makeQueryString(query) {
        var pairs = [];
        var fields = Util.keys(query);
        Util.each(fields, function(item){
            pairs.push(encodeURIComponent(item) + '=' + encodeURIComponent(query[item]));
        });
        return pairs.join('&');
    }

    RecordsManager.prototype.getOne = function (id) {
        var defer = new Promise.Defer();
        var records = this.records;
        var record = records[id];
        var apiConf = this.conf.getOne;
        var url = apiConf.url + '/' + id;

        if (apiConf.query) {
            url = url + '?' + makeQueryString(apiConf.query);
        }

        if (record) {
            defer.resolve(record);
        } else {
            axios.get(url)
                .then(function(res){
                    record = res.data;
                    records[id] = record;
                    defer.resolve(record);
                },function(err){
                    defer.reject(err);
                });
        }

        return defer.promise;
    };
    RecordsManager.prototype.deleteOne = function(recordId){
        var _this = this;
        var defer = new Promise.Defer();
        var url = this.APIS.deleteOne + '/' + recordId;

        axios.delete(url)
            .then(function(res){
                console.log(res);
                _this.deleteLocalOne(recordId);
                defer.resolve(res.data);
            }, function(err){
                defer.reject(err);
            });

        return defer.promise;
    };
    RecordsManager.prototype.saveOne = function (record) {
        var records = this.records;
        var defer = new Promise.Defer();
        var id = record && record._id;
        var method = id ? 'put' : 'post';
        var url = this.APIS.saveOne + '/' + (id || '');
        axios[method](url, record)
            .then(function(res){
                var record = res.data;
                records[id] = record;
                defer.resolve(record);
            },function(err){
                defer.reject(err);
            });
        return defer.promise;
    };
    RecordsManager.prototype.createOne = RecordsManager.prototype.saveOne;
    RecordsManager.prototype.copyOne = function(record) {
        return Util.clone(record);
    };
    RecordsManager.prototype.updataLocalOne = function(record) {
        var id = record._id;
        var records = this.records;
        if (records[id]) records[id] = record;
    };
    RecordsManager.prototype.deleteLocalOne = function(record){
        record = typeof record === 'object' ? record._id : record;
        if (this.records[record]) delete this.records[record];
    };
    RecordsManager.prototype.getPage = function(pageNum, shouldArchive) {
        var defer = new Promise.Defer();
        var pages = this.pages;
        var page = pages[pageNum];
        var url = this.APIS.getPage + '?page=' + pageNum + '&archive=' + shouldArchive;

        if (page) {
            defer.resolve(page);
        } else {
            axios.get(url)
                .then(function(res){
                    page = res.data;
                    page._isArchived = shouldArchive;
                    pages[pageNum] = page;
                    defer.resolve(page);
                },function(err){
                    defer.reject(err);
                });
        }

        return defer.promise;
    };

    return RecordsManager;
});