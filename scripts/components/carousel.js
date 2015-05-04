KISSY.add('carousel', ['node'], function(S, Node){
    /**
     * [Carousel description]
     * @param {[type]} dom [description]
     *
     *
     * ====================================
     * 
     */
    function Carousel(dom, conf) {
        this.dom = typeof dom === 'string' ? Node(dom).getDOMNode() : dom;
        this.slides = Array.prototype.map.call(this.dom.children, function(slide){
            return new Slide(slide);
        });
        
    }
    function Slide(dom) {
        this.dom = dom;
    }
    function Indicator() {

    }

    Carousel.CONF = {

    };

    var proto = Carousel.prototype;
    proto.getSlide = function (index) {

    };
    proto.getSlides = function () {
        return this.slides;
    };
    proto.getIndicators = function () {
        return this.indicators;
    };
    proto.go = function (index) {

    };
    proto.pre = function () {

    };
    proto.next = function () {

    };
    proto.pause = function () {

    };


    return Carousel;
});