/* global URL */
require(['node', 'utils', 'tooltip', 'CONF', 'personAgent', 'mask', 'toast', 'modal', 'io'], function($, Utils, Tooltip, CONF, PersonAgent, Mask, Toast, Modal, IO) {
    var $addPersonBtn = $('.add-person-btn');
    var $facultyEidtorWrapper = $('.faculty-editor-wrapper');
    var $facultyEditor = $('.faculty-editor');
    var $editorCloser = $('.modal__closer');
    var $editorCancelBtn = $('.modal__cancel-btn');
    var $editorConfirmBtn = $('.modal__confirm-btn');

    var $editorAvatarForm = $('#up-form');
    var $personAvatarPreview = $('.person__avatar-preview');
    var $personAvatarSelector = $('.person__avatar-selector');
    var $personNameEditor = $('.person__name-editor');
    var $personRoleEditor = $('.person__role-editor');
    var $personDescriptionEditor = $('.person__description-editor');
    var $gallery = $('.person-gallery');

    var TOOLTIP_EDIT_TEXT = Ecpkn.LANG.actions.edit;
    var TOOLTIP_DELETE_TEXT = Ecpkn.LANG.actions.delete;
    var PERSON_CARD_EDIT_BTN_CLSN = 'person-card__edit-btn';
    var PERSON_CARD_DELETE_BTN_CLSN = 'person-card__delete-btn';
    var PERSON_CARD_AVATAR_CLSN = 'person-card__avatar';
    var PERSON_CARD_NAME_CLSN = 'person-card__name';
    var PERSON_CARD_DESCRIPTION_CLSN = 'person-card__description';
    var PERSON_CARD_ROLE_CLSN = 'person-card__role';
    var PERSON_CARD_EDIT_BTN_SELECTOR = '.' + PERSON_CARD_EDIT_BTN_CLSN;
    var PERSON_CARD_DELETE_BTN_SELECTOR = '.' + PERSON_CARD_DELETE_BTN_CLSN;
    var PERSON_CARD_AVATAR_SELECTOR = '.' + PERSON_CARD_AVATAR_CLSN;
    var PERSON_CARD_NAME_SELECTOR = '.' + PERSON_CARD_NAME_CLSN;
    var PERSON_CARD_ROLE_SELECTOR = '.' + PERSON_CARD_ROLE_CLSN;
    var PERSON_CARD_DESCRIPTION_SELECTOR = '.' + PERSON_CARD_DESCRIPTION_CLSN;

    var currentPerson = null;
    var $currentPersonCard = null;
    var personAgent = new PersonAgent({
        saveOne: {
            url: CONF.API.person.root
        },
        deleteOne: {
            url: CONF.API.person.root
        }
    });

    var UP_URL = CONF.API.person.uploadAvatar;

    Modal.setConf({
        base: {'background-color': 'transparent'}
    });

    function uploadAvatar() {
        var io = new IO({
            url: Utils.appendQueries(UP_URL, {_id: currentPerson._id}),
            type: 'post',
            form: '#up-form',
            dataType: 'json'
        });
        return io;
    }

    function setEditorData(person) {
        person = person || {};
        if (person._id) {
            $facultyEditor.attr('data-id', person._id);
        }
        $personNameEditor.val(person.name);
        $personRoleEditor.val(person.role);
        $personDescriptionEditor.val(person.description);
        $personAvatarPreview.attr('src', person.avatar && person.avatar.url || CONF.APP.defaultAvatar);
    }
    function clearEditorData() {
        $personNameEditor.val('');
        $personRoleEditor.val('');
        $personDescriptionEditor.val('');
        $personAvatarSelector.val('');
        $personAvatarPreview.attr('src', CONF.APP.defaultAvatar);
        $facultyEditor.removeAttr('data-id');
    }

    function setCurrentPerson(person, $card) {
        currentPerson = person;
        $currentPersonCard = $card;
    }

    function prependPersonCard(person) {
        var $card = $('<div>');
        var $editBtn = $('<a>');
        var $deleteBtn = $('<a>');
        var $avatar = $('<img>');
        var $name = $('<h4>');
        var $roleMeta = $('<h4>');
        var $roleIcon = $('<i>');
        var $roleText = $('<span>');
        var $description = $('<p>');

        $editBtn.addClass('person-card__edit-btn fa fa-pencil');
        $deleteBtn.addClass('person-card__delete-btn fa fa-trash');

        $avatar.attr('src', person.avatar && person.avatar.url || CONF.APP.defaultAvatar);

        if (person.avatar && person.avatar.url) {
            $avatar.attr('src', person.avatar.url);
        }
        $avatar.addClass(PERSON_CARD_AVATAR_CLSN);

        $name.addClass(PERSON_CARD_NAME_CLSN);
        $name.text(person.name);

        $roleIcon.addClass('fa fa-flag person-card__meta-label');
        $roleText.addClass(PERSON_CARD_ROLE_CLSN);
        $roleText.text(person.role);
        $roleMeta.addClass('person-card__meta');
        $roleMeta.append($roleIcon);
        $roleMeta.append($roleText);

        $description.addClass(PERSON_CARD_DESCRIPTION_CLSN);
        $description.text(person.description);

        $card.addClass('person-card');
        $card.attr('data-id', person._id);
        $card.append($editBtn);
        $card.append($deleteBtn);
        $card.append($avatar);
        $card.append($name);
        $card.append($roleMeta);
        $card.append($description);

        $gallery.prepend($card);
    }
    function updatePersonCard(person, $card) {
        $card = $card || $currentPersonCard;
        console.log(person);
        if ($card && person && person._id) {
            $card.one(PERSON_CARD_AVATAR_SELECTOR).attr('src', person.avatar && person.avatar.url || CONF.APP.defaultAvatar);
            $card.one(PERSON_CARD_NAME_SELECTOR).text(person.name);
            $card.one(PERSON_CARD_ROLE_SELECTOR).text(person.role);
            $card.one(PERSON_CARD_DESCRIPTION_SELECTOR).text(person.description);
        }
    }

    function isCurrentPersonModified() {

    }

    // 添加、更新person
    function savePerson(person) {
        person = person || getPersonDataFromEditor();
        if (currentPerson && currentPerson._id) {
            person._id = currentPerson._id;
        }
        Utils.disableEl($editorConfirmBtn);
        personAgent.saveOne(person)
            .then(function(res) {
                currentPerson = res;
                Toast.make('saving..');
                var file = $personAvatarSelector[0].files[0];
                return file ? uploadAvatar(file) : res;
            })
            .then(function(res) {
                console.log(res);
                if (res && res.length > 0) {
                    currentPerson.avatar = res[0];
                } else {
                    currentPerson.avatar = {
                        url: $personAvatarPreview.attr('src')
                    };
                }
                Toast.make('done');
                Utils.enableEl($editorConfirmBtn);

                $personAvatarSelector.val('');
                closeEditor()
                    .then(function(){
                        Toast.make();
                        if ($currentPersonCard && $facultyEditor.attr('data-id')) {
                            updatePersonCard(currentPerson);
                        } else {
                            prependPersonCard(currentPerson);
                        }
                    });
            }, function(err) {
                console.log(err);
                Utils.enableEl($editorConfirmBtn);
                $personAvatarSelector.val('');
                //closeEditor();
            });
    }
    function deletePerson($card) {
        var pid = $card.attr('data-id');
        console.log(pid);
        return personAgent.deleteOne(pid)
            .then(function(res) {
                Toast.make('deleted');
                console.log(res);
                $card.fadeOut(0.4, function() {
                    $card.remove();
                });
            }, function() {

            });
    }
    function addPerson() {

    }
    function getPersonDataFromEditor() {
        var person = {
            _id: $facultyEditor.attr('data-id'),
            name: $personNameEditor.val(),
            role: $personRoleEditor.val(),
            description: $personDescriptionEditor.val(),
            avatar: {
                url: $personAvatarPreview.attr('src')
            }
        };
        return person;
    }
    function getPersonDataFromCard($card) {
        var person = {
            _id: $card.attr('data-id'),
            name: $card.one(PERSON_CARD_NAME_SELECTOR).text(),
            role: $card.one(PERSON_CARD_ROLE_SELECTOR).text(),
            description: $card.one(PERSON_CARD_DESCRIPTION_SELECTOR).text(),
            avatar: {
                url: $card.one(PERSON_CARD_AVATAR_SELECTOR).attr('src')
            }
        };
        console.log(person);
        return person;
    }
    function openEditor() {
        $facultyEidtorWrapper.addClass('faculty-editor-wrapper--active');
        return Modal.open($facultyEidtorWrapper)
            .then(function(){
                $facultyEditor.addClass('faculty-editor--up');
            });
    }

    function closeEditor() {
       return Modal.close()
            .then(function(){
                $facultyEditor.removeClass('faculty-editor--up');
            });
    }

    // person manager
    $gallery.delegate('click', '.person-card', function(event){
        var $target = $(event.target);
        var $card = $(event.currentTarget);

        if ($target.hasClass(PERSON_CARD_EDIT_BTN_CLSN)) {
            // edit person
            var person = getPersonDataFromCard($card);
            setCurrentPerson(person, $card);
            setEditorData(person);
            openEditor();

        } else if ($target.hasClass(PERSON_CARD_DELETE_BTN_CLSN)){
            // delete person
            var isAuth = window.confirm('');
            if (isAuth) {
                deletePerson($card);
            }
        }
    });


    // editor manager
    $addPersonBtn.on('click', function() {
        currentPerson = null;
        clearEditorData();
        openEditor();
    });
    $editorCloser.on('click', closeEditor);
    $editorConfirmBtn.on('click', function(){savePerson(); });
    $personAvatarSelector.on('change', function(event) {
        var file = $personAvatarSelector[0].files[0];
        $personAvatarPreview.attr('src', URL.createObjectURL(file));
    });

    // tooltip
    $gallery.delegate('mouseover', PERSON_CARD_EDIT_BTN_SELECTOR, function(event){
        Tooltip.show(event.target, TOOLTIP_EDIT_TEXT);
    });
    $gallery.delegate('mouseover', PERSON_CARD_DELETE_BTN_SELECTOR, function(event){
        Tooltip.show(event.target, TOOLTIP_DELETE_TEXT);
    });
    $gallery.delegate('mouseout', [PERSON_CARD_EDIT_BTN_SELECTOR, PERSON_CARD_DELETE_BTN_SELECTOR], function(event){
        Tooltip.hide();
    });

    Tooltip.init();
    window.Mask = Mask;
    window.Toast = Toast;
    window.personAgent = personAgent;
    window.$editorAvatarForm = $editorAvatarForm;
    window.$personAvatarSelector = $personAvatarSelector;
});
