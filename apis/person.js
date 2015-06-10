var Person = require('../models/person');
var ModelInterface = require('./model-interface');

var _allowedFields = 'name,role,description';
var conf = {
    fields: {
        allowed: _allowedFields.split(',')
    },
    opts: {
        population: 'avatar'
    }
};
// 实例化接口对象
var personApi = new ModelInterface(Person, conf);

module.exports = personApi;
