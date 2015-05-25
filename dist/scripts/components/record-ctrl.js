define('RecordCtrl', ['node', 'utils'], function(require, exports, module){
    var Node = require('node');
    var Utils = require('utils');
    //===================

    function initUEditor(container) {
        var ueditorContainer = document.querySelector('#ueditor-container');
        var editorRect = ueditorContainer.getBoundingClientRect();
        var ue = UE.getEditor(container, {
            initialFrameWidth: editorRect.width,
            initialFrameHeight: editorRect.height - 120,
            initialContent: ueditorContainer.getAttribute('data-placeholder') || '新闻内容'
        });
        ue.ready(function(){
            //disableEditors();
        });
        return ue;
    }
    function RecordCtrl(recordStore, conf) {
        this.conf = Utils.merge(CONF, conf);
        this.recordStore = recordStore;
        this.groups = {};
        this.currentGroup = '';
        this.currentRecord = null;
        this.$currentRecordNode = null;
    }
    var CONF = {
        SELECTORS: {
            RECORDS_ARCHIVES_CONTAINER: 'records-archives-container',
            RECORDS_ARCHIVE:'records-archive', 
            RECORDS_ARCHIVE_TITLE: 'records-archive__title',
            RECORDS_ARCHIVE_BODY: 'records-archive__body',
            RECORD_LIST_ITEM: 'record__list-item',
            RECORD_LIST_ITEM_ACTIVE: 'record__list-item--active',
            RECORD_DELETE_BTN: 'record-delete-btn'
        }
    };
    RecordCtrl.prototype.makeRecordItemNode = function (record) {
        var conf = this.conf;
        var $record = Node('<div>');
        var $recordTitle = Node('<h4>');
        var $recordCreatedAt = Node('<h5>');
        var $recordDeleteBtn = Node('<span>');
        $recordDeleteBtn.addClass('fa fa-trash float--right record-delete-btn');
        $record.addClass(conf.SELECTORS.RECORD_LIST_ITEM);
        $record.attr('data-id', record._id);
        $recordTitle.text(record.title);
        $recordCreatedAt.text((new Date(record.createdAt)).toLocaleString());
        $record.append($recordDeleteBtn);
        $record.append($recordTitle);
        $record.append($recordCreatedAt);
        return $record;
    };
    RecordCtrl.prototype.makeRecordsArchiveNode = function (archive) {
        var _this = this;
        var conf = this.conf;

        var metas = archive.metas;
        var list = archive.list;
        var $archive = Node('<div>');
        var $archiveTitle = Node('<h4>');
        var $archiveBody = Node('<div>');
        $archive.addClass(conf.SELECTORS.RECORDS_ARCHIVE);
        $archiveTitle.addClass(conf.SELECTORS.RECORDS_ARCHIVE_TITLE);
        $archiveBody.addClass(conf.SELECTORS.RECORDS_ARCHIVE_BODY);
        $archiveTitle.text(metas.hash);
        $archive.hash = metas.hash;

        Utils.each(list, function(record){
           $archiveBody.append(_this.makeRecordItemNode(record));
        });

        $archive.append($archiveTitle);
        $archive.append($archiveBody);
        $archive.$body = $archiveBody;
        return $archive;
    };
    RecordCtrl.prototype.updateGroup = function (groupName, records) {
        var _this = this;
        var conf = this.conf;
        var group = this.groups[groupName];
        var $container = group.$container;
        var archives = Utils.archiveRecords(records);

        var $archives = Utils.map(archives, function(archive){
            return _this.makeRecordsArchiveNode(archive);
        });

        var $lastArchive = $container.last();
        if ($lastArchive && $archives[0].hash === $lastArchive.hash) {
            var $archiveToBeMerge = $archives.shift();
        }
        Utils.each($archives, function($archive){
            $container.append($archive);
        });
        group.$archives = group.$archives || [];
        group.$archives = group.$archives.concat($archives);
        return $container;
    };

    RecordCtrl.prototype.isCurrentRecordModified = function() {
        var record = this.currentRecord;
        return record ? (record.title !== $recordTitleInput.val() || record.group !== $recordGroupSelector.val() || record.content !== recordContentEditor.getContent()) : false;
    };
    RecordCtrl.prototype.insertRecord = function (record) {
        console.log(record);
        var group = this.groups[record.group];
        var recordMetas = Utils.makeDateMetas(record.createdAt);
        var $archive = group.$archives && group.$archives[0];
        if ($archive && $archive.hash === recordMetas.hash) {
            $archive.$body.prepend(this.makeRecordItemNode(record));
        } else {
            $archive = this.makeRecordsArchiveNode(Utils.archiveRecords([record])[0]); 
            group.$archives = [$archive].concat(group.$archive);
            group.$container.prepend($archive);
        }
    };
    RecordCtrl.prototype.setCurrentRecord = function($node, record) {
        var conf = this.conf;
        record = record || {};
        this.currentRecord = record;
        recordContentEditor.setContent(record.content);
        $recordTitleInput.val(record.title);
        $recordGroupSelector.val(record.group);
        if (record._id) {
            if (this.$currentRecordNode) {
                this.$currentRecordNode.removeClass(conf.SELECTORS.RECORD_LIST_ITEM_ACTIVE);
            }
            if ($node) {
                this.$currentRecordNode = $node;
            }
            this.$currentRecordNode.addClass(conf.SELECTORS.RECORD_LIST_ITEM_ACTIVE);
            recordContentEditor.execCommand('serverparam', '_id', record._id);
        }
    };
    RecordCtrl.prototype.removeRecordItemNode = function($node) {
        $node.remove();
    };


    RecordCtrl.prototype.switchToGroup = function(groupName) {
        var conf = this.conf;
        var groups = this.groups;
        var group = (groups[groupName] = groups[groupName] || {});
        if (this.currentGroup !== groupName) {
            this.currentGroup = groupName;
            if (!group.$container) {
                group.$container = Node.one('<div>');
                group.$container.addClass(conf.SELECTORS.RECORDS_ARCHIVES_CONTAINE);
            }
            $recordsGroupContainer.empty();
            $recordsGroupContainer.append(group.$container);
            if (group.$container.children().length === 0) {
                this.fillGroup(groupName);
            }
        }
    };
    RecordCtrl.prototype.fillGroup = function(groupName) {
        var recordStore = this.recordStore;
        var group = this.groups[groupName];
        var _this = this;
        recordStore.getOnes(groupName)
            .then(function(res){
                if (res && res.length > 0) {
                    _this.updateGroup(groupName, recordStore.getGroup(groupName));
                } else {
                    group.status = 'empty';
                }
                console.log(res);
            });
    };

    RecordCtrl.prototype.init = function() {
        var _this = this;
        var conf = this.conf;
        var recordStore = this.recordStore;

        // create record
        $recordCreateBtn.on('click', function() {
            if (RecordCtrl.currentRecord && _this.isCurrentRecordModified()) {
                confirm('modified. save?');
            } else {
                var ok = true;
                if (conf.beforeCreateOne) ok = conf.beforeCreateOne.call(_this);
                if (ok) {
                    recordStore.createOne({group: _this.currentGroup})
                        .then(function(record){
                            if (conf.onCreateOneSucceed) conf.onCreateOneSucceed.call(_this, record);
                            _this.insertRecord(record);
                        },function(err){
                            if (conf.onCreateOneFailed) conf.onCreateOneFailed.call(_this, err);
                        });
                }
            }
        });
        // setup record item click
        $recordsGroupContainer.delegate('click', '.' + conf.SELECTORS.RECORD_LIST_ITEM, function(event){
            var $currentRecordNode = Node(event.currentTarget);
            var recordId = $currentRecordNode.attr('data-id');
            var $target = Node(event.target);

            if ($target.hasClass(conf.SELECTORS.RECORD_DELETE_BTN)) {
                recordStore.deleteOne(recordId)
                    .then(function(res){
                        _this.removeRecordItemNode($currentRecordNode);
                    });
            } else {
                recordStore.getOne(recordId)
                    .then(function(record){
                        if (conf.onGetOneSucceed) conf.onGetOneSucceed.call(_this, record);
                        _this.setCurrentRecord($currentRecordNode, record);
                    },function(err){
                        if (conf.onGetOneFailed) conf.onGetOneFailed.call(_this, err);
                    });
            }
        });


        // setup records group change
        $recordsGroupSelector.on('change', function(event){
            var groupName = $recordsGroupSelector.val();
            _this.switchToGroup(groupName);
        });

        // publish record
        $recordPublishBtn.on('click', function(event) {
            if (!_this.currentRecord || !_this.isCurrentRecordModified()) return;

            var modifiedRecord = recordStore.copyOne(_this.currentRecord); 
            modifiedRecord.content = recordContentEditor.getContent();
            modifiedRecord.title = $recordTitleInput.val();
            modifiedRecord.group = $recordGroupSelector.val();
            delete modifiedRecord.attachments;
            delete modifiedRecord.images;

            Utils.disableEl($recordPublishBtn);
            recordStore.saveOne(modifiedRecord)
                .then(function(res){
                    _this.setCurrentRecord(null, res);
                    Utils.enableEl($recordPublishBtn);
                },function(err){
                    console.log(err);
                    Utils.enableEl($recordPublishBtn);
                });
        });

        
        
    };
    var $recordsGroupContainer  = RecordCtrl.$recordGroupsContainer = Node.one('#records-group-container');
    var $recordsLoaderIndicator = RecordCtrl.$recordsLoaderIndicator = Node.one('#records-loader-indicator');
    var $recordTitleInput       = RecordCtrl.$recordTitleInput = Node.one('#record-title-input');
    var $recordPublishBtn       = RecordCtrl.$recordPublishBtn = Node.one('#record-publish-btn');
    var $recordCreateBtn        = RecordCtrl.$recordCreateBtn = Node.one('#record-create-btn');
    var $recordsGroupSelector   = RecordCtrl.$recordsGroupSelector = Node.one('#records-group-selector');
    var $recordGroupSelector    = RecordCtrl.$recordsGroupSelector = Node.one('#record-group-selector');
    var $recordSavaDraftBtn     = RecordCtrl.$recordSaveDraftBtn = Node.one('#record-draft-btn');
    var recordContentEditor     = RecordCtrl.recordContentEditor = initUEditor('ueditor');
    RecordCtrl.currentRecord    = null;

    return RecordCtrl;
});
