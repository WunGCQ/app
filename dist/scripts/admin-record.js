require(['node', 'io', 'CONF', 'RecordManager', 'tooltip', 'toast'], function(Node, IO, CONF, RecordManager, Tooltip, Toast) {
    function initUEditor(container) {
        var editorRect = document.querySelector('#ueditor-container').getBoundingClientRect();
        var ue = UE.getEditor(container, {
            initialFrameWidth: editorRect.width,
            initialFrameHeight: editorRect.height - 120,
            initialContent: '新闻内容'
        });
        ue.ready(function(){
            disableEditors();
        });
        return ue;
    }
    function addRecordToRecordsList(record) {
        var $li = Node('<li>');
        $li.text(record.title).attr('data-id', record._id).addClass('records-list__item');
        $recordsList.prepend($li);
    }
    function setCurrentRecord(record) {
        if (!currentRecord || currentRecord._id !== record._id || isCurrentRecordModified()) {
            if ($recordTitleInput.val() !== record.title) $recordTitleInput.val(record.title);
            if (recordContentEditor.getContent() !== record.content) recordContentEditor.setContent(record.content);
            currentRecord = record;
        }
        if (currentRecord._id) {
            recordContentEditor.execCommand('serverparam', '_id', currentRecord._id);
        }
    }
    function createRecord() {
        if (currentRecord && isCurrentRecordModified()) {

        } else {

        }
    }
    function deleteRecord(){

    }
    function isCurrentRecordModified() {
        return currentRecord ? (currentRecord.title !== $recordTitleInput.val() || currentRecord.content !== recordContentEditor.getContent()) : false;
    }
    function disableEditors() {
        $recordTitleInput.attr('disabled', 'disabled');
        recordContentEditor.setDisabled();
    }
    function enableEditors(){
        $recordTitleInput.removeAttr('disabled');
        recordContentEditor.setEnabled();
    }

    var $recordsList = Node.one('#records-list');
    var $recordTitleInput = Node.one('#record-title-input');
    var recordContentEditor = initUEditor('ueditor');
    var $recordPublishBtn = Node.one('#record-publish-btn');
    var $recordCreateBtn = Node.one('#record-create-btn');
    var $recordSaveDraftBtn = Node.one('#record-draft-btn');
    var currentRecord = null;
    var conf = {
        getOne: CONF.API.record,
        deleteOne: CONF.API.record,
        saveOne: CONF.API.record
    };
    var recordManager = new RecordManager(conf);

    // create record
    $recordCreateBtn.on('click', function() {
        if (currentRecord && isCurrentRecordModified()) {
            confirm('modified. save?');

        } else {
            recordManager.createOne()
                .then(function(record){
                    setCurrentRecord(record);
                    addRecordToRecordsList(record);
                    enableEditors();
                },function(err){

                });
        }
    });

    // publish record
    $recordPublishBtn.on('click', function(event) {
        if (!currentRecord || !isCurrentRecordModified()) return;

        var modifiedRecord = recordManager.copyOne(currentRecord); 
        modifiedRecord.content = recordContentEditor.getContent();
        modifiedRecord.title = $recordTitleInput.val();
        disableBtn($recordPublishBtn);
        recordManager.saveOne(modifiedRecord)
            .then(function(res){
                setCurrentRecord(res);
                enableBtn($recordPublishBtn);
            },function(err){
                console.log(err);
                enableBtn($recordPublishBtn);
            });
    });

    // save draft
    $recordSaveDraftBtn.on('click', function(){
        disableBtn($recordSaveDraftBtn);
        setTimeout(function(){
            enableBtn($recordSaveDraftBtn);
        },2000);
    });

    // set record for edition
    $recordsList.delegate('click', '.records-list__item', function(event){
        var recordId = Node(event.target).attr('data-id');
        recordManager.getOne(recordId)
            .then(function(record){
                enableEditors();
                setCurrentRecord(record);
            },function(err){
                console.log(err);
            });
    });
    $recordsList.delegate('click', '.record-delete-btn', function(event){
        event.stopPropagation();
        var $target = Node.one(event.target);
        var id = $target.attr('data-id');
        recordManager.deleteOne(id)
            .then(function(record){
                console.log(record);
            },function(err){
                console.log(err);
            });
    });

    // delete record
    



    //===================

    function RecordCtrl(recordManager, conf) {
        this.conf = conf;
        this.recordManager = recordManager;
    }

    RecordCtrl.prototype.init = function() {
        var _this = this;
        var conf = this.conf;
        var recordManager = this.recordManager;

        // setup record item click
        RecordCtrl.$recordsList.delegate('click', '.records-list__item', function(event){
            var recordId = Node(event.target).attr('data-id');
            recordManager.getOne(recordId)
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


    Tooltip.init();

    return RecordCtrl;

});