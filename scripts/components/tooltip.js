define('tooltip', ['node', 'utils'], function(require, exports, module) {
    var $ = require('node');
    var Utils = require('utils');

    var CONF = {
        placement: 'bottom',
        triggerType: 'mouse',
        zIndex: '1000',
        standalone: false // wheather an instance has its own tooltip dom or share Tooltip's
    };
    var ARROW_CLASS = {
        top: 'tooltip__arrow--top',
        left: 'tooltip__arrow--left',
        bottom: 'tooltip__arrow--bottom',
        right: 'tooltip__arrow--right'
    };

    function Tooltip(trigger, conf) {
        this.setTrigger(trigger);
        this.setConf(conf);
        this.setRef();
        this.status = 'hidden';
        this.init();
        Tooltip._tables.push(this);
    }
    Tooltip._tables = [];

    Tooltip.buildTooltipNode = function(conf) {
        conf = Utils.merge({}, CONF, conf);
        if (!conf.standalone) {
            return Tooltip.$tooltip;
        }
        var $tooltip = $('<div>').addClass('tooltip-container');
        var $tooltipArrow = $('<div>').addClass('tooltip__arrow').addClass(ARROW_CLASS[conf.placement]);
        var $tooltipContent = $('<div>').addClass('tooltip__content');
        $tooltip.append($tooltipArrow).append($tooltipContent);
        $tooltip.$content = $tooltipContent;
        $tooltip.$arrow = $tooltipArrow;
        return $tooltip;
    };
    Tooltip.$tooltip = Tooltip.buildTooltipNode({
        standalone: true
    });
    document.body.appendChild(Tooltip.$tooltip.getDOMNode());
    Tooltip.init = function(conf) {
        var $triggers = $('[data-type="tooltip"]');
        Utils.each($triggers, function($trigger) {
            new Tooltip($trigger);
        });
    };


    Tooltip.prototype.init = function() {
        var _this = this;
        var conf = this.conf;
        var $trigger = this.$trigger;
        var $tooltip = this.$tooltip = Tooltip.buildTooltipNode(conf);
        var content = conf.content;
        if (conf.standalone) {
            // standalone, set its own content, so we don't need to set content each time it shows
            this.setContent(content);
            this.$ref.parent().append(this.$tooltip.getDOMNode());
            this.pos();
        }

        if (conf.triggerType === 'mouse') {
            $trigger.on('mouseover', function() {
                _this.show();
            });
            $trigger.on('mouseout', function() {
                _this.hide();
            });
        } else {
            $trigger.on('click', function() {
                _this.toggle();
            });
        }
    };
    // after setContent
    Tooltip.prototype.pos = function() {
        setTooltipPosition(this.$tooltip, this.$ref.getDOMNode(), this.conf);
    };
    Tooltip.prototype.setConf = function(conf) {
        var $trigger = this.$trigger;
        var placement = $trigger.attr('data-placement');
        var content = $trigger.attr('data-content');
        var standalone = $trigger.attr('data-standalone');
        conf = conf || {};
        if (placement) conf.placement = placement;
        if (content) conf.content = content;
        if (standalone) conf.standalone = !!standalone;
        this.conf = conf = Utils.merge({}, CONF, conf);
    };
    Tooltip.prototype.setTrigger = function(trigger) {
        this.$trigger = $(trigger);
    };
    Tooltip.prototype.setRef = function(ref) {
        this.$ref = ref ? $(ref) : this.$trigger;
    };
    Tooltip.prototype.setContent = function(content) {
        this.$tooltip.$content.html(content);
        this.conf = Utils.merge(this.conf, {
            content: content
        });
    };
    Tooltip.prototype.show = function() {
        // if !standalone. set content before each show
        if (!this.conf.standalone) {
            this.setContent(this.conf.content);
            this.pos();
        }
        this.status = 'shown';
        this.$tooltip.css({
            opacity: '1',
            'z-index': this.conf.zIndex
        });

    };
    Tooltip.prototype.hide = function() {
        this.status = 'hidden';
        this.$tooltip.css({
            opacity: '0',
            'z-index': '-' + this.conf.zIndex
        });
    };
    Tooltip.prototype.toggle = function() {
        if (this.status === 'hidden') {
            this.show();
        } else {
            this.hide();
        }
    };

    function setTooltipPosition($tooltip, ref, conf) {
        var tooltipDom = $tooltip.getDOMNode();
        var tooltipHeight = tooltipDom.offsetHeight;
        var tooltipWidth = tooltipDom.offsetWidth;
        var rect = null;
        var left;
        var top;

        if (conf.standalone) {
            rect = {
                height: ref.offsetHeight,
                width: ref.offsetWidth,
                left: ref.offsetLeft,
                top: ref.offsetTop
            };
        } else {
            var winScrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            var winScrollLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;

            rect = ref.getBoundingClientRect();
            rect.top += winScrollTop;
            rect.left += winScrollLeft;
            $tooltip.$arrow.replaceClass([ARROW_CLASS.top, ARROW_CLASS.bottom, ARROW_CLASS.left, ARROW_CLASS.right].join(' '), ARROW_CLASS[conf.placement]);
        }

        switch (conf.placement) {
            case 'bottom':
                left = rect.left + (rect.width - tooltipWidth) / 2;
                top = rect.top + rect.height;
                break;
            case 'left':
                left = rect.left - rect.width;
                top = rect.top + (rect.height - tooltipHeight) / 2;
                break;
            case 'right':
                left = rect.left + rect.width;
                top = rect.top + (rect.height - tooltipHeight) / 2;
                break;
        }
        $tooltip.css({
            left: left + 'px',
            top: top + 'px'
        });
    }

    // static methods
    Tooltip.show = function(ref, content, conf) {
        var $tooltip = Tooltip.$tooltip;
        conf = conf || CONF;
        $tooltip.$content.html(content);
        setTooltipPosition($tooltip, ref, conf);
        $tooltip.css({
            opacity: '1',
            'z-index': conf.zIndex
        });
    };
    Tooltip.hide = function() {
        Tooltip.$tooltip.css({
            opacity: '0',
            'z-index': '-' + CONF.zIndex
        });
    };

    window.Ecpkn.Tooltip = Tooltip;
    return Tooltip;
});
