define('utils', ['util'], function(require, exports, module) {
    function Utils() {}
    Utils.prototype = require('util');

    var Ecpkn = window.Ecpkn || {};
    var utils = new Utils();

    Ecpkn.Utils = utils;

    utils.enableEl = function($el) {
        if ($el) {
            $el.removeAttr('disabled');
            if ($el.attr('data-enabled-text')) {
                $el.text($el.attr('data-enabled-text'));
            }
        }
    };
    utils.disableEl = function($el) {
        if ($el) {
            $el.attr('disabled', 'disabled');
            if ($el.attr('data-disabled-text')) {
                $el.text($el.attr('data-disabled-text'));
            }
        }
    };

    utils.appendQueries = function(url, query) {
        var pairs = [];
        var fields = utils.keys(query);
        var hasQuery = url.indexOf('?') !== -1;
        var pre1 = /\?$/.test(url);
        var pre2 = /&$/.test(url);
        utils.each(fields, function(item) {
            pairs.push(encodeURIComponent(item) + '=' + encodeURIComponent(query[item]));
        });

        var prefix = (pre1 || pre2) ? '' : (hasQuery ? '&' : '?');
        pairs = pairs.join('&');
        return url.concat(prefix).concat(pairs);
    };

    // archive records
    function shouldRecordInGroup(record, group) {
        var _metas = group.metas;
        var metas = utils.makeDateMetas(record.createdAt);
        return _metas.year === metas.year && _metas.month === metas.month && _metas.date === metas.date;
    }
    utils.makeDateMetas = function(d) {
        var date = new Date(d);
        var metas = {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            date: date.getDate(),
            value: date.valueOf()
        };
        metas.hash = [metas.date, metas.month, metas.year].join('/');
        return metas;
    };
    utils.archiveRecords = function(records) {
        var len = records.length;
        var archives = [];
        var record = null;
        var i;

        for (i = 0; i < len; i++) {
            record = records[i];
            if (archives.length === 0 || !shouldRecordInGroup(record, archives[archives.length - 1])) {
                archives.push({
                    metas: utils.makeDateMetas(record.createdAt),
                    list: [record]
                });
            } else {
                archives[archives.length - 1].list.push(record);
            }
        }
        return archives;
    };

    return utils;
});
