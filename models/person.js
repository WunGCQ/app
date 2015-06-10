var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Person = new Schema({
    name: {type: String},
    avatar: {type: Schema.Types.ObjectId, ref: 'Attachment'},
    role: {type: String},
    description: {type: String}
});

module.exports = mongoose.model('Person', Person);
