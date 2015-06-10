/* global URL */
require(['node', 'utils', 'tooltip', 'CONF', 'personAgent', 'mask', 'toast', 'modal', 'io'], function($, Utils, Tooltip, CONF, PersonAgent, Mask, Toast, Modal, IO) {
    var $addPersonBtn = $('.add-person-btn');
    var $facultyEidtorWrapper = $('.faculty-editor-wrapper');
    var $facultyEidtor = $('.faculty-editor');
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

    var TOOLTIP_EDIT_TEXT = LANG.actions.edit;
    var TOOLTIP_DELETE_TEXT = LANG.actions.delete;

    var currentPerson = null;
    var personAgent = new PersonAgent({
        saveOne: {
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
        // io.then(function(res){
        //     var data = res[0];
        //     console.log(data);
        // });
        return io;
    }
    function updateEditor(data) {
        data = data || {};
    }
    function prependPersonCard(person) {
        var $card = $('<div>');
        var $editBtn = $('<a>');
        var $deleteBtn = $('<a>');
        var $avatar = $('<img>');
        var $name = $('<h4>');
        var $role = $('<h4>');
        var $roleIcon = $('<i>');
        var $roleText = $('<span>');
        var $description = $('<p>');

        $editBtn.addClass('person-card__edit-btn fa fa-pencil');
        $deleteBtn.addClass('person-card__delete-btn fa fa-trash');

        $avatar.attr('src', person.avatar);
        $avatar.addClass('person-card__avatar');

        $name.text('@' + person.name);

        $roleIcon.addClass('fa fa-flag person-card__meta-label');
        $roleText.text(person.role);
        $role.addClass('person-card__meta');
        $role.append($roleIcon);
        $role.append($roleText);

        $description.addClass('person-card__description');
        $description.text(person.description);

        $card.addClass('person-card');
        $card.append($editBtn);
        $card.append($deleteBtn);
        $card.append($avatar);
        $card.append($name);
        $card.append($role);
        $card.append($description);

        $gallery.prepend($card);
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
                Toast.make('first');
                var file = $personAvatarSelector[0].files[0];
                return file ? uploadAvatar(file) : res;
            })
            .then(function(res) {
                console.log(res);
                var a = res[0];
                currentPerson.avatar = a.url;
                Toast.make('done');
                Utils.enableEl($editorConfirmBtn);

                $personAvatarSelector.val('');
                closeEditor()
                    .then(function(){
                        prependPersonCard(currentPerson);
                    });
            }, function(err) {
                console.log(err);
                Utils.enableEl($editorConfirmBtn);
                $personAvatarSelector.val('');
                closeEditor();
            });
    }
    function addPerson() {

    }
    function getPersonDataFromEditor() {
        var person = {};
        person.name = $personNameEditor.val();
        person.role = $personRoleEditor.val();
        person.description = $personDescriptionEditor.val();
        return person;
    }
    function isCurrentPersonModified() {

    }
    function setCurrentPerson(person) {

    }
    function openEditor() {
        $facultyEidtorWrapper.addClass('faculty-editor-wrapper--active');
        return Modal.open($facultyEidtorWrapper)
            .then(function(){
                $facultyEidtor.addClass('faculty-editor--up');
            });
    }

    function closeEditor() {
       return Modal.close()
            .then(function(){
                $facultyEidtor.removeClass('faculty-editor--up');
            });
    }


    // editor manager
    $addPersonBtn.on('click', openEditor);
    $editorCloser.on('click', closeEditor);
    $editorConfirmBtn.on('click', function(){savePerson(); });
    $personAvatarSelector.on('change', function(event) {
        var file = $personAvatarSelector[0].files[0];
        $personAvatarPreview.attr('src', URL.createObjectURL(file));
        console.log(file);
    });

    // tooltip
    $gallery.delegate('mouseover', '.person-card__edit-btn', function(event){
        Tooltip.show(event.target, TOOLTIP_EDIT_TEXT);
    });
    $gallery.delegate('mouseover', '.person-card__delete-btn', function(event){
        Tooltip.show(event.target, TOOLTIP_DELETE_TEXT);
    });
    $gallery.delegate('mouseout', ['.person-card__edit-btn', '.person-card__delete-btn'], function(event){
        Tooltip.hide();
    });

    Tooltip.init();
    window.Mask = Mask;
    window.Toast = Toast;
    window.personAgent = personAgent;
    window.$editorAvatarForm = $editorAvatarForm;
    window.$personAvatarSelector = $personAvatarSelector;
});
