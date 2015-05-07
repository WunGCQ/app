require(['node', 'carousel'], function(Node, Carousel){
    var carousel = Node.one('.carousel').getDOMNode();
    carousel = new Carousel(carousel);
    console.log(carousel);
});