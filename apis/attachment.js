var Attachment = require('../models/attachment');

exports.get = function (conds, fields, opts) {
    conds = conds || {};
    fields = fields;
    opts = opts || {};
    opts.sort = opts.sort || {createdAt: -1};
    var query = Attachment.find(conds,fields,opts);
    return query.exec();
};

exports.create = function (data) {
    return Attachment.create(data);
};

exports.update = function(id, update, opts) {
    opts = opts || {};
    if (opts.new === undefined) opts.new = true;
    return Attachment.findByIdAndUpdate(id, update, opts).exec();
};

exports.delete = function (id) {

};