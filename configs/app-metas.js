var I18N = require('./lang');
var config = require('./config');

var Ecpkn = {
    '/admin/news': {
        groups: config.db.collections.news.groups
    }
};

function mount(req, res, next) {
    var path = req.path;
    res.locals.Ecpkn = Ecpkn[path];
}

exports.mount = mount;