function getTooltip() {
    return window.Tooltip;
}
describe('Tooltip component', function() {
    before(function() {
        casper.start('http://ecpkn.com/admin/news');
    });
    it('should have a buildin $tooltip node', function() {
        casper.then(function(){
            var Tooltip = this.evaluate(getTooltip);
            expect(Tooltip._tables).to.have.length(4);
        });
    });
});