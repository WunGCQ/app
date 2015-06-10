define('mask', ['node', 'utils', 'anim'], function(require, exports, module) {
    var $ = require('node');
    var Util = require('utils');
    var Anim = require('anim');
    var Mask = {};
    var CONF = {
        base: {
            height: '100%',
            width: '100%',
            position: 'fixed',
            'background-color': '#000000',
            top: '0',
            left: '0'
        },
        show: {
            props: {
                'z-index': 500,
                'background-color': 'rgba(0,0,0,0.3)'
                // 'opacity': '0.98'
            },
            conf: {
                duration: 0.1,
                easing: 'easeNone'
            }
        },
        hide: {
            props: {
                'z-index': '-100',
                'background-color': 'rgba(0,0,0,0)'
                // 'opacity': '0'
            },
            conf: {
                duration: 0.1,
                easing: 'easeNone'
            }
        },
        hideOnMaskClicked: true
    };
    var conf = CONF;
    var isMaskAttached = false;
    var $mask = $('<div>');
    $mask.addClass('mask');
    $mask.on('click', function(event) {
        if (conf.hideOnMaskClicked && $(event.target).hasClass('mask')) {
            Mask.hide();
        }
    });

    Mask.setup = function() {
        $mask.css(conf.hide.props);
        $mask.css(conf.base);
    };
    Mask.config = function(c) {
        conf = Util.mix(conf, c, true, undefined, true);
        Mask.setup();
        return Mask;
    };
    Mask.show = function(c) {
        if (!isMaskAttached) {
            $('body').append($mask);
            Mask.config(c);
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
        if (content !== Mask.content) {
            Mask.content = content;
            $mask.empty();
            $mask.append(content);
        }
        return Mask;
    };
    Mask.CONF = CONF; // export default conf

    return Mask;
});
