define('RecordCtrl', ['node', 'utils'], function(require, exports, module) {
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
        ue.ready(function() {
            freezeCtrls();
        });
        return ue;
    }

    function freezeCtrls() {
        Utils.each($$ctrls, function($ctrl) {
            if ($ctrl) $ctrl.attr('disabled', 'disabled');
        });
        recordContentEditor.setDisabled();
    }
    function activeCtrls() {
        Utils.each($$ctrls, function($ctrl) {
            if ($ctrl) $ctrl.removeAttr('disabled');
        });
        recordContentEditor.setEnabled();
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
            RECORDS_ARCHIVE: 'records-archive',
            RECORDS_ARCHIVE_TITLE: 'records-archive__title',
            RECORDS_ARCHIVE_BODY_TOGGLE: 'records-archive__toggle',
            RECORDS_ARCHIVE_BODY: 'records-archive__body',
            RECORDS_ARCHIVE_ITEMS_COUNTER: 'records-archive__items-counter',
            RECORD_LIST_ITEM: 'record__list-item',
            RECORD_LIST_ITEM_ACTIVE: 'record__list-item--active',
            RECROD_LIST_ITEM_STICKED: 'record__list-item--sticked',
            RECROD_LIST_ITEM_PUBLISHED: 'record__list-item--published',
            RECROD_LIST_ITEM_DRAFT: 'record__list-item--draft',
            RECORD_DELETE_BTN: 'record-delete-btn'
        }
    };
    RecordCtrl.prototype.makeRecordItemNode = function(record) {
        var conf = this.conf;
        var $record = Node('<div>');
        var $recordTitle = Node('<h4>');
        var $recordCreatedAt = Node('<h5>');
        var $recordDeleteBtn = Node('<span>');
        var recordMetas = Utils.makeDateMetas(record.createdAt);
        $recordDeleteBtn.addClass('fa fa-trash record-delete-btn');
        $record.addClass(conf.SELECTORS.RECORD_LIST_ITEM);
        $record.addClass(conf.SELECTORS['RECROD_LIST_ITEM_' + record.status.toUpperCase()]);
        $record.attr('data-id', record._id);
        $record.attr('data-group', record.group);
        $record.attr('data-hash', recordMetas.hash);
        $recordTitle.text(record.title.length > 20 ? record.title.slice(0, 20) + '...' : record.title);
        $recordCreatedAt.text((new Date(record.createdAt)).toLocaleString());
        $record.append($recordTitle);
        $record.append($recordCreatedAt);
        $record.append($recordDeleteBtn);
        return $record;
    };
    RecordCtrl.prototype.makeRecordsArchiveNode = function(archive) {
        var _this = this;
        var conf = this.conf;

        var metas = archive.metas;
        var list = archive.list;
        var $archive = Node('<div>');
        var $archiveTitle = Node('<h4>');
        var $archiveBodyToggle = Node('<span>');
        var $archiveBody = Node('<div>');
        var $archiveItemsCounter = Node('<span>');
        $archiveBodyToggle.addClass(conf.SELECTORS.RECORDS_ARCHIVE_BODY_TOGGLE);
        $archive.addClass(conf.SELECTORS.RECORDS_ARCHIVE);
        $archiveTitle.addClass(conf.SELECTORS.RECORDS_ARCHIVE_TITLE);
        $archiveBody.addClass(conf.SELECTORS.RECORDS_ARCHIVE_BODY);
        $archiveTitle.text(metas.hash);
        $archive.hash = metas.hash;

        Utils.each(list, function(record) {
            $archiveBody.append(_this.makeRecordItemNode(record));
        });

        $archiveItemsCounter.addClass(conf.SELECTORS.RECORDS_ARCHIVE_ITEMS_COUNTER);
        $archiveItemsCounter.text(list.length);
        //$archiveTitle.append($archiveBodyToggle);
        $archiveTitle.append($archiveItemsCounter);
        $archive.append($archiveTitle);
        $archive.append($archiveBody);
        $archive.$body = $archiveBody;
        $archive.$itemsCounter = $archiveItemsCounter;
        return $archive;
    };
    RecordCtrl.prototype.updateGroup = function(groupName, records) {
        var _this = this;
        var conf = this.conf;
        var group = this.groups[groupName];
        var $container = group.$container;
        var archives = Utils.archiveRecords(records);
        var $formerArchives = group.$archives || [];
        var $formerArchive;
        var $archives = Utils.map(archives, function(archive) {
            return _this.makeRecordsArchiveNode(archive);
        });

        for (var i = $formerArchives.length - 1; i >= 0; i--) {
            $formerArchive = $formerArchives[i];
            if ($formerArchive.hash === $archives[0].hash) {
                var $archiveToBeMerge = $archives.shift();
                var $item;
                while ($item = $archiveToBeMerge.$body.first()) {
                    var count = $formerArchive.$itemsCounter.text();
                    $formerArchive.$itemsCounter.text(count++);
                    $formerArchive.$body.append($item);
                }
            }
        }

        if ($archives && $archives.length > 0) {
            Utils.each($archives, function($archive) {
                $container.append($archive);
            });
            console.log($archives);
            group.$archives = $formerArchives.concat($archives);
        }

        return $container;
    };

    RecordCtrl.prototype.isCurrentRecordModified = function(r) {
        var record = this.currentRecord;
        return record ?
            (record.title !== $recordTitleInput.val() ||
            record.group !== $recordGroupSelector.val() ||
            record.content !== recordContentEditor.getContent() ||
            (r && record.status !== r.status)) :
            false;
    };
    RecordCtrl.prototype.getGroup = function(groupName) {
        var conf = this.conf;
        var group = (this.groups[groupName] = this.groups[groupName] || {});
        if (!group.$container) {
            group.$container = Node.one('<div>');
            group.$container.addClass(conf.SELECTORS.RECORDS_ARCHIVES_CONTAINE);
        }
        if (!group.$archives) {
            group.$archives = [];
        }
        return group;
    };
    RecordCtrl.prototype.insertRecord = function(record) {
        console.log(record);
        var group = this.getGroup(record.group);
        var recordMetas = Utils.makeDateMetas(record.createdAt);
        var archivesLen = group.$archives && group.$archives.length;
        var $archive;
        var $recordNode = null;
        if (archivesLen > 0) {
            for (var i = 0; i < archivesLen; i++) {
                $archive = group.$archives[i];
                if ($archive && $archive.hash === recordMetas.hash) {
                    $recordNode = this.makeRecordItemNode(record);
                    $archive.$itemsCounter.text(+$archive.$itemsCounter.text() + 1);
                    $archive.$body.prepend($recordNode);
                    break;
                }
            }
        }
        if (!$recordNode) {
            $archive = this.makeRecordsArchiveNode(Utils.archiveRecords([record])[0]);
            $recordNode = $archive.$body.first();
            group.$archives = [$archive].concat(group.$archives);
            group.$container.prepend($archive);
        }
        return $recordNode;
    };
    RecordCtrl.prototype.setCurrentRecord = function($node, record) {
        activeCtrls();

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
            $recordStickBtn.setStatus(record.status);
            recordContentEditor.execCommand('serverparam', '_id', record._id);
        }
    };
    RecordCtrl.prototype.removeRecordItemNode = function($node) {
        var $archives;
        var $archive;
        var $itemsCounter;
        var count;
        var hash;
        $node = $node || this.$currentRecordNode;
        if ($node) {
            $archives = this.groups[$node.attr('data-group')].$archives;
            hash = $node.attr('data-hash');
            for (var i = $archives.length - 1; i >= 0; i--) {
                if ($archives[i].hash === hash) {
                    $archive = $archives[i];
                    $itemsCounter = $archive.$itemsCounter;
                    count = +$itemsCounter.text();
                    $node.remove();
                    $itemsCounter.text(--count);
                    if (count === 0) {
                        $archives.splice(i, 1);
                        $archive.remove();
                    }
                    break;
                }
            }
        }
    };

    RecordCtrl.prototype.switchToGroup = function(groupName) {
        var group;
        if (this.currentGroup !== groupName) {
            group = this.getGroup(groupName);
            this.currentGroup = groupName;
            $recordsGroupContainer.empty();
            $recordsGroupContainer.append(group.$container);
            if (group.$container.children().length === 0) {
                this.fillGroup(groupName);
            }
        }
    };
    RecordCtrl.prototype.fillGroup = function(groupName) {
        var recordStore = this.recordStore;
        var group = this.getGroup(groupName);
        var _this = this;
        recordStore.getOnes(groupName)
            .then(function(res) {
                if (res && res.length > 0) {
                    _this.updateGroup(groupName, recordStore.getGroup(groupName));
                } else {
                    group.status = 'empty';
                }
                console.log(res);
            });
    };
    RecordCtrl.prototype.disableEditors = function() {

    };

    RecordCtrl.prototype.enableEditors = function() {

    };

    RecordCtrl.prototype.getModifiedRecordData = function() {
        var currentRecord = this.currentRecord;
        var record = null;
        var title;
        var group;
        var content;

        if (currentRecord) {
            record = {};
            title = $recordTitleInput.val();
            group = $recordGroupSelector.val();
            content = recordContentEditor.getContent();

            if (content !== currentRecord.content) record.content = content;

            record.title = title;
            record.group = group;
            record._id = currentRecord._id;
            record.status = currentRecord.status;
        }

        return record;
    };

    RecordCtrl.prototype.updateRecord = function(record) {
        var _this = this;
        var recordStore = this.recordStore;

        // if (!_this.currentRecord || !_this.isCurrentRecordModified(record)) return;

        record = record || {};
        record._id = record._id || _this.currentRecord._id;

        //_this.disableEditors();
        console.log(record);
        return recordStore.saveOne(record)
            .then(function(res) {
                _this.removeRecordItemNode();
                _this.setCurrentRecord(_this.insertRecord(res), res);
                //_this.enableEditors();
                return res;
            }, function(err) {
                console.log(err);
                _this.enableEditors();
                return err;
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
                    recordStore.createOne({
                            group: _this.currentGroup
                        })
                        .then(function(record) {
                            if (conf.onCreateOneSucceed) conf.onCreateOneSucceed.call(_this, record);
                            _this.insertRecord(record);
                        }, function(err) {
                            if (conf.onCreateOneFailed) conf.onCreateOneFailed.call(_this, err);
                        });
                }
            }
        });
        // setup record item click
        $recordsGroupContainer.delegate('click', '.' + conf.SELECTORS.RECORD_LIST_ITEM, function(event) {
            var $currentRecordNode = Node(event.currentTarget);
            var recordId = $currentRecordNode.attr('data-id');
            var $target = Node(event.target);

            if ($target.hasClass(conf.SELECTORS.RECORD_DELETE_BTN)) {
                recordStore.deleteOne(recordId)
                    .then(function(res) {
                        _this.removeRecordItemNode($currentRecordNode);
                    });
            } else {
                recordStore.getOne(recordId)
                    .then(function(record) {
                        if (conf.onGetOneSucceed) conf.onGetOneSucceed.call(_this, record);
                        _this.setCurrentRecord($currentRecordNode, record);
                    }, function(err) {
                        if (conf.onGetOneFailed) conf.onGetOneFailed.call(_this, err);
                    });
            }
        });

        // slideup slideDown
        $recordsGroupContainer.delegate('click', '.' + conf.SELECTORS.RECORDS_ARCHIVE_TITLE, function(event) {
            var $title = Node(event.currentTarget);
            var $body = $title.next();
            $body.slideToggle(0.2);
        });

        // setup records group change
        $recordsGroupSelector.on('change', function(event) {
            var groupName = $recordsGroupSelector.val();
            _this.switchToGroup(groupName);
        });

        // publish record
        $recordPublishBtn.on('click', function(event) {
            var record = _this.getModifiedRecordData();
            if (!record) return;
            record.status = record.status === 'sticked' ? 'sticked' : 'published';
            if (_this.isCurrentRecordModified(record)) {
                Utils.disableEl($recordPublishBtn);
                _this.updateRecord(record)
                    .then(function(r) {
                        Utils.enableEl($recordPublishBtn);
                    }, function(err) {
                        Utils.enableEl($recordPublishBtn);
                    });
            }
        });

        // draft
        $recordSaveDraftBtn.on('click', function(event) {
            var record = _this.getModifiedRecordData();
            if (!record) return;
            record.status = 'draft';
            if (_this.isCurrentRecordModified(record)) {
                Utils.disableEl($recordSaveDraftBtn);
                _this.updateRecord(record)
                    .then(function(r) {
                        Utils.enableEl($recordSaveDraftBtn);
                    }, function(err) {
                        Utils.enableEl($recordSaveDraftBtn);
                    });
            }
        });

        // stick || unstick record
        $recordStickBtn.on('click', function() {
            var currentRecord = _this.currentRecord;
            if (!currentRecord) return;
            var status = currentRecord.status;
            var record;
            if (status === 'draft') {
                confirm('该文档未发布，置顶后将该为发布状态，确认继续?');
            } else {
                $recordStickBtn.setStatus('applying');
                record = _this.getModifiedRecordData();
                record.status = status === 'sticked' ? 'published' : 'sticked';
                if (_this.isCurrentRecordModified(record)) {
                    _this.updateRecord(record)
                        .then(function(res) {
                            console.log('/// stick res');
                            console.log(res);
                        });
                }
            }
        });

    };
    var $recordsGroupContainer = RecordCtrl.$recordGroupsContainer = Node.one('#records-group-container');
    var $recordsLoaderIndicator = RecordCtrl.$recordsLoaderIndicator = Node.one('#records-loader-indicator');
    var $recordTitleInput = RecordCtrl.$recordTitleInput = Node.one('#record-title-input');
    var $recordPublishBtn = RecordCtrl.$recordPublishBtn = Node.one('#record-publish-btn');
    var $recordCreateBtn = RecordCtrl.$recordCreateBtn = Node.one('#record-create-btn');
    var $recordSaveDraftBtn = RecordCtrl.$recordSaveDraftBtn = Node.one('#record-draft-btn');
    var $recordStickBtn = RecordCtrl.$recordStickBtn = Node.one('#record-stick-btn');
    var $recordsGroupSelector = RecordCtrl.$recordsGroupSelector = Node.one('#records-group-selector');
    var $recordGroupSelector = RecordCtrl.$recordsGroupSelector = Node.one('#record-group-selector');
    var recordContentEditor = RecordCtrl.recordContentEditor = initUEditor('ueditor');
    var $$ctrls = RecordCtrl.$$ctrls = [
        $recordPublishBtn, $recordSaveDraftBtn, $recordStickBtn,
        $recordTitleInput, $recordGroupSelector];
    RecordCtrl.currentRecord = null;

    $recordStickBtn.setStatus = (function() {
        var stickText = $recordStickBtn.attr('data-stick-text');
        var unstickText = $recordStickBtn.attr('data-unstick-text');
        var stickedText = $recordStickBtn.attr('data-sticked-text');
        return function(status) {
            if (status === 'applying') {
                Utils.disableEl($recordStickBtn);
            } else {
                $recordStickBtn.attr('data-enabled-text', status === 'sticked' ? stickedText : stickText);
                Utils.enableEl($recordStickBtn);
            }
        };
    })();

    return RecordCtrl;
});
