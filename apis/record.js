var Record = require('../models/record');
var ModelInterface = require('./model-interface');

var conf = {
    opts: {
        population: 'images attachments'
    }
};
// 实例化接口对象
var recordApi = new ModelInterface(Record, conf);

module.exports = recordApi;
