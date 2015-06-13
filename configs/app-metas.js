var I18N = require('./lang');
var config = require('./config');

var ECPKN = {
    '/admin/home': {
        page: 'home'
    },
    '/admin/news': {
        page: 'news',
        category: 'news',
        groups: config.db.collections.record.news.groups
    },
    '/admin/announcements': {
        page: 'announcements',
        category: 'announcement',
        groups: config.db.collections.record.announcement.groups
    },
    '/admin/faculty': {
        page: 'faculty',
        category: 'faculty'
    }
};

function getEcpknMetas(path) {
    var ecpkn = ECPKN[path];
    return ecpkn;
}

function mount(req, res, next) {
    var lang = req.query.lang || req.body.lang || 'zh';
    var path = req.path;

    var Ecpkn = getEcpknMetas(path);
    var LANG = res.locals.LANG = I18N[lang];

    if (Ecpkn) {
        LANG.record = LANG[Ecpkn.category];
        res.locals.Ecpkn = Ecpkn;
    }
    res.locals.exposedLANG = I18N.exposed[lang];

    next();
}

module.exports = mount;
