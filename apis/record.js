var Record = require('../models/record');
var config = require('../configs/config');
var Q = require('q');
var archiveRecord = require('../utils/archive-record');

var allowedFileds = 'title,content,createdAt,category,group'.split(',');
function isQueryFieldAllowed(field) {
   return allowedFileds.indexOf(field) !== -1; 
}

exports.get = function (conds, fields, opts, query) {
    var defer = Q.defer();
    conds = conds || {};
    fields = fields;
    opts = opts || {};
    query = query || {};
    opts.sort = opts.sort || {createdAt: -1};

    // limit, skip
    var page = opts.page || query.page || -1;

    if(page > 0){
        opts.limit = config.app.record.PER_PAGE;
        opts.skip = (page - 1) * config.app.record.PER_PAGE;
    } else {
        opts.limit = opts.limit || query.limit || config.app.record.LIMIT;
        opts.skip = opts.skip || query.skip || config.app.record.SKIP;
    }

    for (var key in query) {
        if (isQueryFieldAllowed(key)) {
            conds[key] = query[key];
        }
    }
    console.log(conds);
    console.log(fields);
    console.log(opts);
    //return Record.find(conds,fields,opts).exec();
    var _query = Record.find(conds,fields,opts);
    _query.populate({
        path: 'images',
        options: {
            sort:{
                createdAt: -1
            }
        },
    });
    return _query.exec();
};

exports.create = function (data) {
    return Record.create(data);
};

exports.update = function(id, update, opts) {
    opts = opts || {};
    if (opts.new === undefined) opts.new = true;
    return Record.findByIdAndUpdate(id, update, opts).exec();
};

exports.delete = function (conds, fields, opts) {
    return this.get(conds, fields, opts)
        .then(function(records){
            if (records.length > 0) {
                return Q.all(records.map(function(record){
                    return record.remove();
                }));
            } else {
                var defer = Q.defer();
                defer.resolve();
                return defer.promise;
            }
        });
};