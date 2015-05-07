define('carousel', ['node', 'promise'], function(require, exports, module) {
    var Node = require('node');
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
     *            .carousel__indicator
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
     *         #
     *
     */
    var reqAnimFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    var arrProto = Array.prototype;
    var proto;

    function Carousel(dom, conf) {
        dom = typeof dom === 'string' ? Node(dom).getDOMNode() : dom;
        this.conf = conf || Carousel.CONF;
        this.dom = dom;

        this.indicators = arrProto.map.call(dom.lastElementChild.children, function(indicator) {
            return new Indicator(indicator, this);
        }, this);
        this.slides = arrProto.map.call(dom.firstElementChild.children, function(slide, i) {
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


        if (arrProto.indexOf.call(dom.parentElement.children, dom) === 0) {
            indicator.active();
        } else {
            var transform = 'translateX(100%)';
            style.webkitTransform = transform;
            style.mozTransform = transform;
            style.transform = transform;
        }
        style.opacity = 1;


        this.subLayers = arrProto.map.call(dom.querySelectorAll('.carousel__slide__sublayer'), function(subLayer) {
            return new SubLayer(subLayer);
        });

    }

    //////// don't do this.. should support older browsers. maybe left to some prefixer plugins
    Slide.ANIM = {};

    function SubLayer(dom) {
        this.dom = dom;
    }

    function Indicator(dom) {
        this.dom = dom;
    }


    Carousel.CONF = {
        DUR: 2600, // duration. auto loop slides after every DUR
        TD: 800 // transition duration between slides
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

        var from = {};
        var to = {};
        from.tx = direction <= 2 ? 0 : (direction === 3 ? -100 : 100);
        from.op = direction <= 2 ? 1 : 0;
        to.tx = direction >= 2 ? 0 : (direction === 1 ? -100 : 100);
        to.op = direction >= 2 ? 1 : 0;

        direction > 2 ? this.indicator.active() : this.indicator.inActive();
        var tween = new TWEEN.Tween(from);
        tween.to(to, _this.carousel.conf.TD)
            // .easing(TWEEN.Easing.Linear.None)
            .onUpdate(function() {
                _this.updateSlide(this);
            })
            .onComplete(function() {
                tween.done = true;
                defer.resolve();
            })
            .start();
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
        console.log(pos);
        var style = this.dom.style;
        var transform = 'translateX(' + pos.tx + '%)';
        style.webkitTransform = transform;
        style.mozTransform = transform;
        style.transform = transform;
        // style.left = pos.tx + 'px';
        // style.opacity = pos.op;
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
        this.loop();
    };
    proto.loop = function() {
        var _this = this;
        _this.timer = setTimeout(function() {
            _this.next().then(function() {
                _this.loop();
            });
        }, _this.conf.DUR);

    };
    proto.go = function(index) {
        var slidesCount = this.slides.length;
        var currentSlide = this.slides[this.currentIndex];
        var isNext = index > this.currentIndex;

        index = (index + slidesCount) % slidesCount;
        this.currentIndex = index;

        var nextSlide = this.slides[index];
        var inPromise = nextSlide.trans(isNext ? 4 : 3);
        var outPromise = currentSlide.trans(isNext ? 1 : 2);
        return Promise.all([inPromise, outPromise]);
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