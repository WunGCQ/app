KISSY.use('node, anim, carousel', function(s, Node, Anim, Carousel) {
    var carousel = Node.one('.carousel').getDOMNode();
    carousel = new Carousel(carousel);
    console.log(carousel);


});