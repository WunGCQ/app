var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var chaiHttp = require('chai-http');
var Q = require('q');

// setup chai http plugin && promise 
chai.use(chaiHttp);
chai.request.addPromises(Q.Promise);

describe('Test sample', function () {
    var res;
    before(function(done){
        res = {
           statusCode: 200,
           text: 'hello world' 
        }
        done();
    });
    it('should got \'hello world\'',function(){
        expect(res.text).to.equal('hello world');
    });
    it('should has status as 200', function(){
        expect(res).to.have.status(200);
    });
});