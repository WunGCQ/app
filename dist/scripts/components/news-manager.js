/**
 * 依赖 axios
 */

define('NewsManager', ['CONF', 'RecordManager', 'promise', 'utils'], function(require, exports, module){
    var CONF = require('CONF');
    var RecordManager = require('RecordManager');
    //===================================
    var conf = {
        getOne: CONF.API.record,
        deleteOne: CONF.API.record,
        saveOne: CONF.API.record
    };
    var manager = new RecordManager(conf);
    return manager;
});