define('CONF',function(){
    var CONF = {};
    var API = CONF.API = {};
    var admin = API.admin = {};
    var public = API.public = {};

    var apiRoot = 'http://ecpkn.com';
    API.root = apiRoot;
    API.news = API.root + '/admin/news';
    API.record = API.root + '/records';

    admin.root = API.root + '/admin';
    admin.news = admin.root + '/news';



    return CONF;
});