'use strict';

var mongoose = require('mongoose'),
    config = require('../configs/config'),
    Schema = mongoose.Schema;

var NEWS_STATUS_ENUM = ['published', 'draft'];

var News = new Schema({
    title: {type: String, default: '', trim: true},
    content: {type: String, default: '', trim: true},
    category: {type: String},
    status: {type: String, enum: NEWS_STATUS_ENUM}, // 新闻状态：发布、草稿 
    tags:[{type:String,trim: true}],
    lang: {type: String, default: 'zh'},
    url: {type: String, trim: true}, // url to this news
    images:[{type:Schema.Types.ObjectId, ref:'Image'}], // images in news
    createdAt: {type: Date, default: Date.now()},
    hash: {type: String, trim: true} // post-title
});







module.exports = mongoose.model('News',News);