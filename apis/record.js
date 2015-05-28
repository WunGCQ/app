/**
 * Record Model 操作的公用 api， 包括常用的查询，更新，删除，创建操作。其他比如 news,announcement
 * 相关的特定接口可以先 require(./record), 然后在其基础上添加.
 * @type {[type]}
 */
var Record = require('../models/record');
var config = require('../configs/config');
var Q = require('q');
var archiveRecord = require('../utils/archive-record');
var api = {};

var allowedFileds = '_id,title,content,createdAt,category,group,status,lang,images,attachments';
allowedFileds = allowedFileds.split(',');

function isQueryFieldAllowed(field) {
    return allowedFileds.indexOf(field) !== -1;
}

/**
 * 通过外部查询条件 query 来构造实际的查询条件
 * @param  {[type]} conds [description]
 * @param  {[type]} query [description]
 * @return {[type]}       [description]
 */
function parseConds(conds, query) {
    conds = conds || {};
    query = query || {};
    for (var key in query) {
        if (isQueryFieldAllowed(key)) {
            conds[key] = query[key];
        }
    }
    return conds;
}

/**
 * [parseOpts description]
 * @param  {[type]} opts  [description]
 * @param  {[type]} query [description]
 * @return {[type]}       [description]
 */
function parseOpts(opts, query) {
    opts = opts || {};
    query = query || {};
    opts.sort = opts.sort || {
        createdAt: -1
    };

    // limit, skip
    var page = opts.page || query.page;
    opts.limit = opts.limit || query.limit || config.app.record.LIMIT;
    opts.skip = page > 0 ?
        (page - 1) * opts.limit :
        (opts.skip || query.skip || config.app.record.SKIP);

    return opts;
}

/**
 * 根据 conds, opts 进行查询，返回 promise, 通过该 promise 可以获取结果数组
 * @param  {object} conds  查询条件，
 * @param  {string} fields 结果条目中应该包含或不包含(使用prefix`!`来设置)的字段
 * @param  {object} opts 查询限制的条件，如 limit, skip, sort等
 * @param  {object} query  外部查询条件，用于构造 conds, opts
 * @return {promise} onfulfill: [Array]
 *
 * ======== example:
 * var Record = require('/apis/record');
 * app.use('/records', function(req, res){
 *     // get list, 结果条目中不需要包含 content 字段
 *     Record.get(null, '-content' , null, req.query)
 *         .then(function(list){
 *             list instanceof Array // true
 *             res.render('public/news-list', {
 *                 data: resData
 *             });
 *         });
 *     // get one,
 *     Record.get({_id: req.query.id}, null, null, req.query)
 *         .then(function(list){
 *             var record = list[0];
 *             res.render('public/news-detail',{
 *                 news: record
 *             });
 *         })
 * });
 */
api.get = function(conds, fields, opts, query) {
    var defer = Q.defer();
    if (query) {
        conds = parseConds(conds, query);
        opts = parseOpts(opts, query);
    }

    console.log(conds);
    console.log(fields);
    console.log(opts);
    var _query = Record.find(conds, fields, opts);
    _query.populate('images attachments');
    return _query.exec();
};

/**
 * 根据 conds 查询数据库,返回 promise, 通过该 promise 可以获取结果页，
 * @param  {object} conds 查询条件。可以为 null，直接通过 parseConds(conds,query) 来构造
 * @param  {number | object} page  如果是 number 类型则表明获取查询结果的第几页;
 * 如果是 object 类型数据则作为外部查询条件来构造实际进行查询所需要的 conds 和 opts,
 * @return {Promise}       通过该 promise 可以获取查询结果页数据，onfulfill:
 * {
 *     count: [number]查询结果总条目数,
 *     currentPage: [number]当前结果为第几页,
 *     pageCount: [number] 结果总页数
 *     list: [Array] 查询结果数据项集合
 * }
 * ======== example:
 * var Record = require('/apis/record');
 * app.use('/records', function(req, res){
 *     Record.getPage(null, req.query)
 *         .then(function(resData){
 *             resData.count //
 *             resData.list instanceof Array // true
 *             res.render('public/news-list', {
 *                 data: resData
 *             });
 *         });
 * });
 */
api.getPage = function(conds, page) {
    var defer = Q.defer();
    var query = typeof page === 'object' ? page : {
        page: page
    };
    var opts = parseOpts(null, query);
    var fields = '-content';
    var resData = {};
    conds = parseConds(conds, query);

    api.get(conds, fields, opts)
        .then(function(list) {
            resData.list = list;
            return api.getCount(conds);
        })
        .then(function(count) {
            resData.count = count;
            resData.currentPage = Math.ceil((opts.skip + 1) / opts.limit) || 1;
            resData.pageCount = Math.ceil(count / opts.limit);
            defer.resolve(resData);
        }, function(err) {
            delete resData.list;
            resData.err = err;
            defer.reject(resData);
        });

    return defer.promise;
};

api.create = function(data) {
    return Record.create(data);
};

api.update = function(id, update, opts) {
    opts = opts || {};
    if (opts.new === undefined) {
        opts.new = true;
    }
    return Record.findByIdAndUpdate(id, update, opts).exec();
};

api.delete = function(conds, fields, opts) {
    return this.get(conds, fields, opts)
        .then(function(records) {
            if (records.length > 0) {
                return Q.all(records.map(function(record) {
                    return record.remove();
                }));
            } else {
                var defer = Q.defer();
                defer.resolve();
                return defer.promise;
            }
        });
};

/**
 * 根据 conds 查询，返回 promise, 在 onfulfill 中可获取查询结果的总条目数，
 * @param  {object} conds 查询条件
 * @param  {object} query 外部查询条件， 可用于构造 conds
 * @return {promise}       [description]
 */
api.getCount = function(conds, query) {
    if (query) {
        conds = parseConds(conds, query);
    }
    return Record.count(conds).exec();
};

api._parseConds = parseConds;
api._parseOpts = parseOpts;

module.exports = api;
