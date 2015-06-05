var News = require('../models/record');
var ModelInterface = require('./model-interface');

var conf = {
    opts: {
        population: 'images attachments'
    }
};
// 实例化接口对象
var newsApi = new ModelInterface(News, conf);

module.exports = newsApi;
