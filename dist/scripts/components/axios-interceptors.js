if (window.axios) {
    axios.interceptors.request.use(function(config) {
        console.log(config);
        if (config.method !== 'get') {
            var _query = 'lang=' + window.LANG_CODE;
            var isPrefixed = config.url.lastIndexOf('?') !== -1;
            var isSuffixed = config.url.lastIndexOf('&') === config.url.length - 1;
            if (!isPrefixed) {
                _query = '?' + _query;
            } else if (!isSuffixed) {
                _query = '&' + _query;
            }
            config.url += _query;
        }
        return config;
    });
}
