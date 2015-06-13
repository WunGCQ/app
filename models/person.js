var config = require('../configs/config');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AttachmentAPI = require('../apis/attachment');
var CATEGORIES_ENUM = config.db.metas.PERSON_CATEGORIES;
var GROUPS_ENUM = config.db.metas.PERSON_GROUPS;

var Person = new Schema({
    name: {type: String},
    avatar: {type: Schema.Types.ObjectId, ref: 'Attachment'},
    category: {type: String, required: true, enum: CATEGORIES_ENUM},
    group: {type: String, enum: GROUPS_ENUM},
    role: {type: String},
    title: {type: String},
    description: {type: String},
    status: {type: String},
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
