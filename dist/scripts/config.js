define('CONF', function() {
    var CONF = {};
    var API = CONF.API = {};
    var APP = CONF.APP = {};
    var admin = API.admin = {};
    var public = API.public = {};
    var person = API.person = {};

    var apiRoot = 'http://ecpkn.com';
    apiRoot = '';
    API.root = apiRoot;
    API.news = API.root + '/admin/news';
    API.record = API.root + '/records';

    admin.root = API.root + '/admin';
    admin.news = admin.root + '/news';

    person.root = API.root + '/persons';
    person.uploadAvatar = '/admin/attachments?action=uploadimage&type=avatar&target=person';

    APP.defaultAvatar = '/statics/images/default-avatar.png';

    return CONF;
});
