var Announcement = require('../models/record');
var ModelInterface = require('./model-interface');

var conf = {
    opts: {
        population: 'images attachments'
    }
};
// 实例化接口对象
var announcementApi = new ModelInterface(Announcement, conf);

module.exports = announcementApi;
