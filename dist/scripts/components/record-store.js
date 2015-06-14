define('RecordStore', ['CONF', 'promise', 'utils', 'ModelStore'], function(require, exports, module) {
    var Promise = require('promise');
    var Utils = require('utils');

    var ModelStore = require('ModelStore');

    function RecordStore(conf) {
        ModelStore.call(this, conf);
        this.groups = {};
        this._prepare();
    }
    RecordStore.prototype = Utils.merge(ModelStore.prototype, {
        _prepare: function() {
            var groups = this.groups;
            Utils.each(this.conf.groups, function(group) {
                groups[group] = [];
            });
        },
        getOnes: function(groupName) {
            var group = this.groups[groupName];
            var defer = new Promise.Defer();
            var apiConf = this.conf.getOnes;
            var url = apiConf.url;

            url = Utils.appendQueries(url, Utils.merge(apiConf.queries, {
                group: groupName,
                skip: group.length
            }));

            axios.get(url)
                .then(function(res) {
                    var items = res.data.list;
                    console.log(res);
                    group.push.apply(group, items);
                    defer.resolve(items);
                }, function(err) {
                    defer.reject(err);
                });

            return defer.promise;
        },
        getGroup: function(groupName) {
            return this.groups[groupName];
        }
    });
    return RecordStore;
});
