define('ModelStore', ['CONF', 'promise', 'utils'], function(require, exports, module) {
    var Promise = require('promise');
    var Utils = require('utils');
    //===================================
    /**
     * RecordManager
     * @param {[type]} APIS [description]
     */
    function ModelStore(conf) {
        this.conf = conf;
        this.items = {};
    }

    ModelStore.prototype.getOne = function(id) {
        var defer = new Promise.Defer();
        var items = this.items;
        var item = items[id];
        var apiConf = this.conf.getOne;
        var url = apiConf.url + '/' + id;

        if (item) {
            defer.resolve(item);
        } else {
            if (apiConf.queries) {
                url = Utils.appendQueries(url, apiConf.queries);
            }
            axios.get(url)
                .then(function(res) {
                    item = res.data.data;
                    items[id] = item;
                    defer.resolve(item);
                }, function(err) {
                    defer.reject(err);
                });
        }

        return defer.promise;
    };
    ModelStore.prototype.deleteOne = function(itemId) {
        var _this = this;
        var defer = new Promise.Defer();
        var apiConf = this.conf.deleteOne;
        var url = apiConf.url + '/' + itemId;

        axios.delete(url)
            .then(function(res) {
                console.log(res);
                _this.deleteLocalOne(itemId);
                defer.resolve(res.data);
            }, function(err) {
                defer.reject(err);
            });

        return defer.promise;
    };
    ModelStore.prototype.saveOne = function(item) {
        item = item || {};
        var items = this.items;
        var defer = new Promise.Defer();
        var apiConf = this.conf.saveOne;
        var id = item._id;
        var method = id ? 'put' : 'post';
        var url = apiConf.url + '/' + (id || '');

        if (apiConf.params) {
            item = Utils.merge(apiConf.params, item);
        }
        console.log(item);

        axios[method](url, item)
            .then(function(res) {
                item = res.data;
                items[item._id] = item;
                defer.resolve(item);
            }, function(err) {
                defer.reject(err);
            });
        return defer.promise;
    };
    ModelStore.prototype.createOne = ModelStore.prototype.saveOne;
    ModelStore.prototype.copyOne = function(item) {
        return Utils.clone(item);
    };
    ModelStore.prototype.updateLocalOne = function(item) {
        var id = item._id;
        var items = this.items;
        if (items[id]) {
            items[id] = item;
        }
    };
    ModelStore.prototype.deleteLocalOne = function(item) {
        item = typeof item === 'object' ? item._id : item;
        if (this.items[item]) {
            delete this.items[item];
        }
    };

    return ModelStore;
});
