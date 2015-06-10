var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AttachmentAPI = require('../apis/attachment');

var Person = new Schema({
    name: {type: String},
    avatar: {type: Schema.Types.ObjectId, ref: 'Attachment'},
    role: {type: String},
    description: {type: String},
    createdAt: {type: Date, default: Date.now}
});


Person.post('remove', function() {
    var person = this;
    var avatar = person.avatar;
    if (avatar) {
        AttachmentAPI.get({_id: avatar})
            .then(function(attachments) {
                var attachment = attachments && attachments[0];
                if (attachment) {
                    attachment.remove();
                }
            });
    }
});

module.exports = mongoose.model('Person', Person);
