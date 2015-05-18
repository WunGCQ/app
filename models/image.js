'use strict';

var mongoose = require('mongoose'),
    config = require('../configs/config'),
    Schema = mongoose.Schema;

var Image = new Schema({
    name: {type: String, required:true, trim: true},
    originalName: {type: String, required: true, trim: true},
    path: {type: String, required: true, trim: true},
    extension: {type: String, required: true, trim: true},
    size: {type: Number, required: true},
    createdAt: {type: Date, default: Date.now()}
});







module.exports = mongoose.model('Image',Image);