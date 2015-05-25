'use strict';

var mongoose = require('mongoose');
var config = require('../configs/config');
var Schema = mongoose.Schema;
var fs = require('fs');

var Attachment = new Schema({
    originalName: {type: String, trim: true},
    name: {type: String, trim: true},
    extension: {type: String, trim: true},
    mimetype: {type: String},
    size: {type: Number},
    path: {type: String, trim: true},
    dir: {type: String}, // relative to app/
    url: {type: String},
    source: {type: String},
    createdAt: {type: Date, default: Date.now()}
});

Attachment.post('remove', function(){
    fs.unlink(this.path, function(err){
    });
});

module.exports = mongoose.model('Attachment',Attachment);