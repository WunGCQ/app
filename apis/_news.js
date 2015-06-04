var News = require('../models/record');
var ModelHelper = require('./model-helper');

var conf = {
    opts: {
        population: 'images attachments'
    }
};
// 实例化接口对象
var newsApi = new ModelHelper(News, conf);

module.exports = newsApi;
