define('toast', ['node', 'utils', 'promise', 'mask'], function(require, exports, module) {
    var $ = require('node');
    var Mask = require('mask');
    var Promise = require('promise');
    var Utils = require('utils');

    var Toast = {};
    var isToastDomAttached = false;
    var CONF = {
        shown_dur: 2000,
        in_dur: 0.2,
        out_dur: 0.2
    };
    var $toast = $('<div>');
    $toast.addClass('toast');

    function parseOpts(opts) {
        opts = Utils.merge(CONF, opts);
        return opts;
    }

    function showToast(opts) {
        if (!isToastDomAttached) {
            $('body').append($toast);
            isToastDomAttached = true;
        }

        $toast.fadeIn(opts.in_dur);
    }
    function hideToast(opts) {
        $toast.fadeOut(opts.out_dur);
    }

    Toast.make = function(content, opts) {
        opts = parseOpts(opts);
        clearTimeout(Toast.timer);
        $toast.html(content);
        showToast(opts);
        Toast.timer = setTimeout(function() {
            hideToast(opts);
        }, opts.shown_dur);
    };

    return Toast;
});
