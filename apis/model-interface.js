/**
 * Model 操作的公用 api 封装， 包括常用的查询，更新，删除，创建操作。
 */

var config = require('../configs/config');
var Q = require('q');
var _ = require('lodash');

var _allowedFields = '_id,title,content,createdAt,category,group,status,lang,images,attachments';
var CONF = {
    opts: {
        limit: config.app.default.LIMIT,
        skip: config.app.default.SKIP,
        sort: {
            createdAt: -1
        }
    },
    fields: {
        allowed: _allowedFields.split(','),
        page: '-content' // fields for getPage
    }
};

function ModelInterface(model, conf) {
    this.model = model;
    this.conf = _.merge({}, CONF, conf);
}
var proto = ModelInterface.prototype;

proto.isQueryFieldAllowed = function(field) {
    return this.conf.fields.allowed.indexOf(field) !== -1;
};

/**
 * 通过外部查询条件 query 来构造实际的查询条件
 * @param  {[type]} conds [description]
 * @param  {[type]} query [description]
 * @return {[type]}       [description]
 */
proto.parseConds = function(conds, query) {
    conds = conds || {};
    query = query || {};
    for (var key in query) {
        if (this.isQueryFieldAllowed(key)) {
            conds[key] = query[key];
        }
    }
    return conds;
};

/**
 * [parseOpts description]
 * @param  {[type]} opts  [description]
 * @param  {[type]} query [description]
 * @return {[type]}       [description]
 */
proto.parseOpts = function parseOpts(opts, query) {
    var _opts = this.conf.opts;
    opts = opts || {};
    query = query || {};
    opts.sort = opts.sort || _opts.sort;

    // limit, skip
    var page = opts.page || query.page;
    opts.limit = opts.limit || query.limit || _opts.limit;
    opts.skip = page > 0 ?
        (page - 1) * opts.limit :
        (opts.skip || query.skip || _opts.skip);

    return opts;
};

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
proto.get = function(conds, fields, opts, query) {
    var defer = Q.defer();
    if (query) {
        conds = this.parseConds(conds, query);
        opts = this.parseOpts(opts, query);
    }

    console.log(conds);
    console.log(fields);
    console.log(opts);
    var _query = this.model.find(conds, fields, opts);
    var population = this.conf.opts.population;
    if (population) {
        _query.populate(population);
    }
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
proto.getPage = function(conds, page) {
    var _this = this;
    var defer = Q.defer();
    var query = typeof page === 'object' ? page : {
        page: page
    };
    var opts = _this.parseOpts(null, query);
    var fields = this.conf.fields.page;
    var resData = {};
    conds = _this.parseConds(conds, query);

    _this.get(conds, fields, opts)
        .then(function(list) {
            resData.list = list;
            return _this.getCount(conds);
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

proto.create = function(data) {
    return this.model.create(data);
};

proto.update = function(id, update, opts) {
    opts = opts || {};
    if (opts.new === undefined) {
        opts.new = true;
    }
    return this.model.findByIdAndUpdate(id, update, opts).exec();
};

proto.delete = function(conds, fields, opts) {
    return this.get(conds, fields, opts)
        .then(function(items) {
            if (items.length > 0) {
                return Q.all(items.map(function(item) {
                    return item.remove();
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
proto.getCount = function(conds, query) {
    if (query) {
        conds = this.parseConds(conds, query);
    }
    return this.model.count(conds).exec();
};

module.exports = ModelInterface;
