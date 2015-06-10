var Attachment = require('../models/attachment');
var ModelInterface = require('./model-interface');

var conf = {};
// 实例化接口对象
var attachmentApi = new ModelInterface(Attachment, conf);

module.exports = attachmentApi;
