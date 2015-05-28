var I18N = require('./lang');
var config = require('./config');

var Ecpkn = {
    '/admin/news': {
        groups: config.db.collections.news.groups,
    },
};

function getEcpknMetas(path, LANG) {
    var ecpkn = Ecpkn[path];

    return ecpkn;
}

function mount(req, res, next) {
    var lang = req.query.lang || req.body.lang || 'zh';
    var path = req.path;

    res.locals.LANG = I18N[lang];
    res.locals.Ecpkn = getEcpknMetas(path, res.locals.LANG);
    next();
}

module.exports = mount;
