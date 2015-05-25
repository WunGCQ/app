define('RecordManager', ['node'], function(require, exports, module){
    var Node = require('node');
    //===================

    function initUEditor(container) {
        var editorRect = document.querySelector('#ueditor-container').getBoundingClientRect();
        var ue = UE.getEditor(container, {
            initialFrameWidth: editorRect.width,
            initialFrameHeight: editorRect.height - 120,
            initialContent: '新闻内容'
        });
        ue.ready(function(){
            //disableEditors();
        });
        return ue;
    }
    function RecordManager(recordStore, conf) {
        this.conf = conf;
        this.recordStore = recordStore;
    }

    RecordManager.prototype.init = function() {
        var _this = this;
        var conf = this.conf;
        var recordStore = this.recordStore;

        // setup record item click
        RecordManager.$recordsList.delegate('click', '.records-list__item', function(event){
            var recordId = Node(event.target).attr('data-id');
            recordStore.getOne(recordId)
                .then(function(record){
                    if (conf.onGetOneSucceed) conf.onGetOneSucceed.call(_this, record);
                },function(err){
                    if (conf.onGetOneFailed) conf.onGetOneFailed.call(_this, err);
                });
        });
        
        
    };
    RecordManager.$recordsList = Node.one('#records-list');
    RecordManager.$recordTitleInput = Node.one('#record-title-input');
    RecordManager.$recordPublishBtn = Node.one('#record-publish-btn');
    RecordManager.$recordCreateBtn = Node.one('#record-create-btn');
    RecordManager.$recordSaveDraftBtn = Node.one('#record-draft-btn');
    RecordManager.recordContentEditor = initUEditor('ueditor');
    RecordManager.currentRecord = null;

    return RecordManager;
});
