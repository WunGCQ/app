if (window.axios) {
    axios.interceptors.request.use(function(config) {
        config.url += ('?lang=' + window.LANG_CODE); 
        return config;
    });
}