define('toast', ['node', 'mask'], function(require, exports, module){
    var $ = require('node');
    var Mask = require('mask');

    var Toast = {};
    var conf = {};
    var $toast = $('<div>');

    Toast.make = function(text, opts) {
        Mask.conf(conf)
            .show()
            .then(function(){
                Mask.hide();
            });
    };

    return Toast;
});