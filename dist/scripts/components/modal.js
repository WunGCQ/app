define('modal', ['node', 'mask'], function(require, exports, module) {
    var Mask = require('mask');
    var $ = require('node');
    var Modal = {};

    Modal.setConf = function(conf) {
        Mask.config(conf);
        return Modal;
    };
    Modal.open = function ($content) {
        if ($content && Modal.$content !== $content) {
            Modal.$content = $content;
            Mask.setContent($content);
        }
        return Mask.show();
    };
    Modal.close = function () {
        return Mask.hide();
    };
    Modal.setHeader = function () {

    };
    return Modal;
});
