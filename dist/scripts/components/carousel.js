define('carousel', ['node', 'promise'], function(require, exports, module) {
    var $ = require('node');
    var Promise = require('promise');
    /**
     * Carousel component.
     * =================================================
     * // dom structure:
     *    .carousel
     *        .carousel__slides-wrapper
     *            .carousel__slide(data-conf="")
     *                .carousel__slide__sublayer
     *        .carousel__indicators-wrapper
     *            .carousel__slide__indicator
     * ------------------------------
     * // Carousel
     *         #init()
     *         #loop()
     *         #go()
     *         #pre()
     *         #next()
     *         #pause()
     *         #resume()
     * // Slide
     *         #trans(direction)
     *         #updateSlide(pos)
     * // SubLayer
     *     /////////// TODO: support sublayer animation
     *
     */
    var reqAnimFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    var arrProto = Array.prototype;
    var proto;

    // TODO: use a prefixer plugin instead: prefixfree
    var setTransform = function _setTransform(style, transform) {
        style.webkitTransform = transform;
        style.mozTransform = transform;
        style.transform = transform;
    };

    function Carousel(dom, conf) {
        dom = typeof dom === 'string' ? $(dom).getDOMNode() : dom;
        this.conf = conf || Carousel.CONF;
        this.dom = dom;

        var slides = dom.querySelectorAll('.carousel__slide');
        var indicators = dom.querySelectorAll('.carousel__slide__indicator');

        this.indicators = arrProto.map.call(indicators, function(indicator) {
            return new Indicator(indicator, this);
        }, this);
        this.slides = arrProto.map.call(slides, function(slide, i) {
            return new Slide(slide, this.indicators[i], this);
        }, this);

        this.currentIndex = 0;
        this.init();
    }

    function Slide(dom, indicator, carousel) {
        var style = dom.style;
        this.dom = dom;
        this.carousel = carousel;
        this.indicator = indicator;

        // set the first slide as default
        if (arrProto.indexOf.call(dom.parentElement.children, dom) === 0) {
            indicator.active();
        } else {
            setTransform(style, 'translateX(100%)');
        }
        style.opacity = 1;

        this.subLayers = arrProto.map.call(dom.querySelectorAll('.carousel__slide__sublayer'), function(subLayer) {
            return new SubLayer(subLayer);
        });
    }


    function SubLayer(dom) {
        this.dom = dom;
    }

    function Indicator(dom) {
        this.dom = dom;
    }

    Carousel.CONF = {
        mute: 2600, // time in ms. auto loop slides after every break
        duration: 600, // transition duration between slides
        auto_start: true // should slide auto start or not
    };

    //=============\
    // Slide.prototype
    proto = Slide.prototype;
    /**
     * switch slide as {direction} specs
     * @param  {number} direction direction for slide transition. which is:
     *                            1: center to left => out // tx: 0 ~ -100%, opacity: 1 ~ 0, dur: 1
     *                            2: center to right => out // tx: 0 ~ 100%, opacity: 1 ~ 0, dur: 1
     *                            3: left to center => out // tx: -100% ~ 0, opacity: 0 ~ 1, dur: 1
     *                            4: right to center => out // tx: 100% ~ 0, opacity: 0 ~ 1, dur: 1
     */
    proto.trans = function(direction) {
        var _this = this;
        var defer = new Promise.Defer();
        var promise = defer.promise;

        // slide transition attrs
        var from = {};
        var to = {};
        from.tx = direction <= 2 ? 0 : (direction === 3 ? -100 : 100);
        from.op = direction <= 2 ? 1 : 0;
        to.tx = direction > 2 ? 0 : (direction === 1 ? -100 : 100);
        to.op = direction > 2 ? 1 : 0;

        direction > 2 ? this.indicator.active() : this.indicator.inActive();

        var tween = new TWEEN.Tween(from);
        tween.to(to, _this.carousel.conf.duration)
            .easing(TWEEN.Easing.Quintic.InOut)
            .onUpdate(function() {
                _this.updateSlide(this);
            })
            .onComplete(function() {
                tween.done = true;
                defer.resolve();
            })
            .start();

        // setup Tween update loop
        function tick(ts) {
            if (!ts) {
                ts = +(new Date());
            }
            tween.update(ts);
            if (!tween.done) {
                reqAnimFrame(tick);
            }
        }
        reqAnimFrame(tick);

        return promise;
    };
    proto.updateSlide = function(pos) {
        setTransform(this.dom.style, 'translateX(' + pos.tx + '%)');
    };

    //=============\
    // Indicator.prototype
    proto = Indicator.prototype;
    proto.active = function() {
        this.dom.classList.add('carousel__slide__indicator--active');
    };
    proto.inActive = function() {
        this.dom.classList.remove('carousel__slide__indicator--active');
    };

    //=============\
    // Carousel.prototype
    proto = Carousel.prototype;
    proto.init = function() {
        var _this = this;
        var $carousel = $(_this.dom);
        var conf = _this.conf;
        var slideSwitcher = function(event) {
            var $target = $(event.currentTarget);
            var index = $target.index();
            if (index !== _this.currentIndex) {
                _this.pause();
                if (_this.promise) {
                    _this.promise.then(function(){
                        _this.go(index);
                    });
                } else {
                    _this.go(index);
                }
            }
        };
        var resume = function(event){
            _this.resume();
        };

        $carousel.delegate('mouseover', '.carousel__slide__indicator', slideSwitcher);
        $carousel.delegate('mouseleave', '.carousel__indicators-wrapper', resume);
        if (conf.auto_start) {
            _this.loop();
        }
    };
    proto.loop = function() {
        var _this = this;
        _this.timer = setTimeout(function() {
            _this.next().then(function() {
                _this.loop();
            });
        }, _this.conf.mute);
    };
    proto.go = function(index) {
        var slidesCount = this.slides.length;
        var currentSlide = this.slides[this.currentIndex];
        var isNext = index > this.currentIndex;

        index = (index + slidesCount) % slidesCount;
        console.log('trans from %d to %d', this.currentIndex + 1, index + 1);
        this.currentIndex = index;

        var nextSlide = this.slides[index];
        var inPromise = nextSlide.trans(isNext ? 4 : 3);
        var outPromise = currentSlide.trans(isNext ? 1 : 2);
        this.promise = Promise.all([inPromise, outPromise]);

        return this.promise;
    };
    proto.pre = function() {
        return this.go(this.currentIndex - 1);
    };
    proto.next = function() {
        return this.go(this.currentIndex + 1);
    };
    proto.pause = function() {
        clearTimeout(this.timer);
    };
    proto.resume = proto.loop;

    return Carousel;
});