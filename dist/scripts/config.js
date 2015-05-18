define('CONF',function(){
    var CONF = {};
    var API = CONF.API = {};
    var apiRoot = 'http://ecpkn.com';


    API.root = apiRoot;

    API.news = API.root + '/admin/news';


    return CONF;
});