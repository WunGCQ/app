define('personAgent', ['promise'], function(require, exports, module) {
    var Promise = require('promise');

    function PersonAgent(conf) {
        this.conf = conf;
        this.cache = {};
    }
    var proto = PersonAgent.prototype;

    proto.saveOne = function (person) {
        person = person || {};
        var _this = this;
        var defer = new Promise.Defer();
        var apiConf = this.conf.saveOne;
        var id = person._id;
        var method = id ? 'put' : 'post';
        var url = apiConf.url + '/' + (id || '');
        axios[method](url, person)
            .then(function(res){
                person = res.data;
                if (person._id) {
                    _this.cache[person._id] = person;
                }
                defer.resolve(person);
            }, function(err) {
                defer.reject(err);
            });
        return defer.promise;
    };
    proto.deleteOne = function(personId) {
        var _this = this;
        var defer = new Promise.Defer();
        var apiConf = this.conf.deleteOne;
        var url = apiConf.url + '/' + personId;

        axios.delete(url)
            .then(function(res) {
                console.log(res);
                delete _this.cache[personId];
                defer.resolve(res.data);
            }, function(err) {
                defer.reject(err);
            });
        return defer.promise;
    };

    return PersonAgent;
});
