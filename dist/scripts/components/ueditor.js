define('ueditor', [], function(require, exports, module){
    var CONTAINER
    function initUEditor(container) {
        var editorRect = document.querySelector('#ueditor-container').getBoundingClientRect();
        var ue = UE.getEditor('ueditor', {
            initialFrameWidth: editorRect.width,
            initialFrameHeight: editorRect.height - 120,
            initialContent: '新闻内容'
        });
        window.ue = ue;
        ue.ready(function(){
            disableEditors();
        });
        return ue;
    }

    return initUEditor;

});