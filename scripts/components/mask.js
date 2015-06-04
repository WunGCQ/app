define('mask', ['node', 'util', 'anim'], function(require, exports, module) {
    var $ = require('node');
    var Util = require('util');
    var Anim = require('anim');
    var Mask = {};
    var CONF = {
        base: {
            height: '100%',
            width: '100%',
            position: 'fixed',
            top: '0',
            left: '0'
        },
        show: {
            props: {
                'z-index': 1000,
                'background-color': 'rgba(0,0,0,0.8)'
            },
            conf: {
                duration: 0.2,
                easing: 'easeNone'
            }
        },
        hide: {
            props: {
                'z-index': '-10',
                'background-color': 'rgba(0,0,0,0)'
            },
            conf: {
                duration: 0.2,
                easing: 'easeNone'
            }
        }
    };
    var conf = CONF;
    var isMaskAttached = false;
    var $mask = $('<div>');
    $mask.on('click', function() {
        Mask.hide();
    });

    Mask.setup = function() {
        $mask.css(conf.hide.props);
        $mask.css(conf.base);
    };
    Mask.conf = function(c) {
        conf = Util.mix(conf, c, true, undefined, true);
        Mask.setup();
        return Mask;
    };
    Mask.show = function(c) {
        if (!isMaskAttached) {
            $('body').append($mask);
            Mask.conf(c);
            isMaskAttached = true;
        }
        var anim = new Anim($mask, conf.show.props, conf.show.conf);
        return anim.run();
    };
    Mask.hide = function(cb) {
        var anim = new Anim($mask, conf.hide.props, conf.hide.conf);
        return anim.run();
    };
    Mask.setContent = function(content) {
        $mask.html(content);
        return Mask;
    };
    Mask.CONF = CONF; // export default conf

    return Mask;
});
