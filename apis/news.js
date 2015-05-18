/**
 * #get
 * @type {[type]}
 */
var News = require('../models/news');

exports.get = function (conds, fields, opts) {
    conds = conds || {};
    fields = fields;
    opts = opts || {};
    opts.sort = opts.sort || {createdAt: -1};
    var query = News.find(conds,fields,opts);
    return query.exec();
};

exports.create = function (data) {
    var error = {};
    error.status = true;

    data = data || {};
    var news = new News(data);
    return news.save();
};

exports.update = function(id, update, opts) {
    opts = opts || {};
    if (opts.new === undefined) opts.new = true;
    return News.findByIdAndUpdate(id, update, opts);
};

exports.delete = function (id) {

};