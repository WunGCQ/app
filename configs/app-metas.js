var I18N = require('./lang');
var config = require('./config');

var ECPKN = {
    '/admin/news': {
        category: 'news',
        groups: config.db.collections.news.groups,
    },
    '/admin/announcements': {
        category: 'announcement',
        groups: config.db.collections.news.groups,
    }
};

function getEcpknMetas(path) {
    var ecpkn = ECPKN[path];
    return ecpkn;
}

function mount(req, res, next) {
    var lang = req.query.lang || req.body.lang || 'zh';
    var path = req.path;

    var Ecpkn =  getEcpknMetas(path);
    lang = res.locals.LANG = I18N[lang];
    if (Ecpkn) {
        lang.record = lang[Ecpkn.category];
        res.locals.Ecpkn = Ecpkn;
    }
    next();
}

module.exports = mount;
