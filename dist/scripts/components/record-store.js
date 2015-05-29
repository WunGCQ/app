define('RecordStore', ['CONF', 'promise', 'utils'], function(require, exports, module) {
    var Promise = require('promise');
    var Utils = require('utils');
    //===================================
    /**
     * RecordManager
     * @param {[type]} APIS [description]
     */
    function RecordStore(conf) {
        this.conf = conf;
        this.records = {};
        this.groups = {};
        this._prepare();
    }

    function makeQueryString(query) {
        var pairs = [];
        var fields = Utils.keys(query);
        Utils.each(fields, function(item) {
            pairs.push(encodeURIComponent(item) + '=' + encodeURIComponent(query[item]));
        });
        return pairs.join('&');
    }

    RecordStore.prototype._prepare = function() {
        var groups = this.groups;
        Utils.each(this.conf.groups, function(group) {
            groups[group] = [];
        });
    };

    RecordStore.prototype.getOne = function(id) {
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
                .then(function(res) {
                    record = res.data.data;
                    records[id] = record;
                    defer.resolve(record);
                }, function(err) {
                    defer.reject(err);
                });
        }

        return defer.promise;
    };
    RecordStore.prototype.deleteOne = function(recordId) {
        var _this = this;
        var defer = new Promise.Defer();
        var apiConf = this.conf.deleteOne;
        var url = apiConf.url + '/' + recordId;

        axios.delete(url)
            .then(function(res) {
                console.log(res);
                _this.deleteLocalOne(recordId);
                defer.resolve(res.data);
            }, function(err) {
                defer.reject(err);
            });

        return defer.promise;
    };
    RecordStore.prototype.saveOne = function(record) {
        record = record || {};
        var records = this.records;
        var defer = new Promise.Defer();
        var apiConf = this.conf.saveOne;
        var id = record._id;
        var method = id ? 'put' : 'post';
        var url = apiConf.url + '/' + (id || '');

        if (apiConf.params) {
            record = Utils.merge(apiConf.params, record);
        }
        console.log(record);

        axios[method](url, record)
            .then(function(res) {
                var record = res.data;
                records[id] = record;
                defer.resolve(record);
            }, function(err) {
                defer.reject(err);
            });
        return defer.promise;
    };
    RecordStore.prototype.createOne = RecordStore.prototype.saveOne;
    RecordStore.prototype.copyOne = function(record) {
        return Utils.clone(record);
    };
    RecordStore.prototype.updataLocalOne = function(record) {
        var id = record._id;
        var records = this.records;
        if (records[id]) {
            records[id] = record;
        }
    };
    RecordStore.prototype.deleteLocalOne = function(record) {
        record = typeof record === 'object' ? record._id : record;
        if (this.records[record]) {
            delete this.records[record];
        }
    };
    RecordStore.prototype.getOnes = function(groupName, pageName) {
        var group = this.groups[groupName];
        var defer = new Promise.Defer();
        var apiConf = this.conf.getOnes;
        var url = apiConf.url;

        url = url + '?' + makeQueryString({
            category: 'news',
            group: groupName,
            skip: group.length
        });

        axios.get(url)
            .then(function(res) {
                var records = res.data.list;
                console.log(res);
                group.push.apply(group, records);
                defer.resolve(records);
            }, function(err) {
                defer.reject(err);
            });

        return defer.promise;
    };
    RecordStore.prototype.getGroup = function(groupName) {
        return this.groups[groupName];
    };
    RecordStore.prototype.getPage = function(group, pageNum, shouldArchive) {
        group = this.groups[group];
        var defer = new Promise.Defer();
        var pages = (group.pages = group.pages || {});
        var page = pages[pageNum];
        var apiConf = this.conf.getPage;
        var url = apiConf.url + '?page=' + pageNum;
        if (shouldArchive) {
            url += ('&archive=' + shouldArchive);
        }

        if (page) {
            page._source = 'cached';
            defer.resolve(page);
        } else {
            axios.get(url)
                .then(function(res) {
                    page = res.data;
                    pages[pageNum] = page;
                    defer.resolve(page);
                }, function(err) {
                    defer.reject(err);
                });
        }

        return defer.promise;
    };

    return RecordStore;
});
