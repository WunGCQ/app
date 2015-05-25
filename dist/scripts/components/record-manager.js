define('RecordCtrl', ['node'], function(require, exports, module){
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
    function RecordCtrl(recordStore, conf) {
        this.conf = conf;
        this.recordStore = recordStore;
    }

    RecordCtrl.prototype.init = function() {
        var _this = this;
        var conf = this.conf;
        var recordStore = this.recordStore;

        // setup record item click
        RecordCtrl.$recordsList.delegate('click', '.records-list__item', function(event){
            var recordId = Node(event.target).attr('data-id');
            recordStore.getOne(recordId)
                .then(function(record){
                    if (conf.onGetOneSucceed) conf.onGetOneSucceed.call(_this, record);
                },function(err){
                    if (conf.onGetOneFailed) conf.onGetOneFailed.call(_this, err);
                });
        });
        
        
    };
    RecordCtrl.$recordsList = Node.one('#records-list');
    RecordCtrl.$recordTitleInput = Node.one('#record-title-input');
    RecordCtrl.$recordPublishBtn = Node.one('#record-publish-btn');
    RecordCtrl.$recordCreateBtn = Node.one('#record-create-btn');
    RecordCtrl.$recordSaveDraftBtn = Node.one('#record-draft-btn');
    RecordCtrl.recordContentEditor = initUEditor('ueditor');
    RecordCtrl.currentRecord = null;

    return RecordCtrl;
});
