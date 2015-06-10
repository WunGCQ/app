var _ = require('lodash');


var zh = require('./zh');
var en = require('./en');
var fr = require('./fr');


var fields = 'LANG,LANG_CODE,actions,announcement,faculty,feedbacks,news,sections,status'.split(',');

exports.zh = zh;
exports.en = en;
exports.fr = fr;

exports.exposed = {
    zh: _.pick(zh, fields),
    en: _.pick(en, fields),
    fr: _.pick(fr, fields)
};
