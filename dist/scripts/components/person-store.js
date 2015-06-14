define('PersonStore', ['CONF', 'promise', 'utils', 'ModelStore'], function(require, exports, module) {
    var Promise = require('promise');
    var Utils = require('utils');

    var ModelStore = require('ModelStore');
    function PersonStore(conf) {
        ModelStore.call(this, conf);
    }
    PersonStore.prototype = Utils.merge(ModelStore.prototype, {

    });

    return PersonStore;
});
