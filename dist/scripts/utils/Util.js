define('_util', ['node', 'util', 'anim'], function(require, exports, module){
    var Ecpkn = Ecpkn || {};
    var Utils = (Ecpkn.Utils = Ecpkn.Utils || {});

    Utils.prototype = require('util');

    Utils.enableEl = function($el) {
        $el.removeAttr('disabled');
        if ($el.attr('data-enabled-text')) {
            $el.text($el.attr('data-enabled-text'));
        }
    };
    Utils.disableEl = function($el){
        $el.attr('disabled','disabled');
        if ($el.attr('data-disabled-text')) {
            $el.text($el.attr('data-disabled-text'));
        }
    };

    return Utils;
});