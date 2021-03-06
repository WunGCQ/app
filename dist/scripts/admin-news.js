require(['node', 'CONF', 'RecordStore', 'RecordCtrl', 'tooltip', 'toast'],
    function(Node, CONF, RecordStore, RecordCtrl, Tooltip, Toast) {
    //===================================
    var conf = {
        getOne: {
            url: CONF.API.record
        },
        getOnes: {
            url: CONF.API.record,
            queries: {
                category: 'news'
            }
        },
        deleteOne: {
            url: CONF.API.record,
            params: {

            }
        },
        saveOne: {
            url: CONF.API.record,
            params: {
                category: 'news',
                group: 'default'
            }
        },
        getPage: {
            url: CONF.API.record
        },
        groups: Ecpkn.groups
    };
    var ctrlConf = {
        beforeCreateOne: function() {
            return true;
        },
        onGetOneSucceed: function() {}
    };
    var recordStore = new RecordStore(conf);
    var recordCtrl = new RecordCtrl(recordStore, ctrlConf);
    recordCtrl.switchToGroup('default');
    window.recordCtrl = recordCtrl;
    Tooltip.init();
    recordCtrl.init();
});
