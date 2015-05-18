require(['node', 'io', 'CONF', 'newsManager', 'tooltip', 'toast'], function(Node, IO, CONF, NewsManager, Tooltip, Toast) {
    function initUEditor(container) {
        var editorRect = document.querySelector('#ueditor-container').getBoundingClientRect();
        var ue = UE.getEditor(container, {
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
    function addNewsToNewsList(news) {
        var $li = Node('<li>');
        $li.text(news.title).attr('data-id', news._id).addClass('news-list__item');
        $newsList.prepend($li);
    }
    function setCurrentNews(news) {
        if (!currentNews || currentNews._id !== news._id || isCurrentNewsModified()) {
            if ($newsTitleInput.val() !== news.title) $newsTitleInput.val(news.title);
            if (newsContentEditor.getContent() !== news.content) newsContentEditor.setContent(news.content);
            currentNews = news;
        }
    }
    function createNews() {
        if (currentNews && isCurrentNewsModified()) {

        } else {

        }
    }
    function deleteNews(){

    }
    function isCurrentNewsModified() {
        return currentNews ? (currentNews.title !== $newsTitleInput.val() || currentNews.content !== newsContentEditor.getContent()) : false;
    }
    function disableEditors() {
        $newsTitleInput.attr('disabled', 'disabled');
        newsContentEditor.setDisabled();
    }
    function enableEditors(){
        $newsTitleInput.removeAttr('disabled');
        newsContentEditor.setEnabled();
    }
    function enableBtn($btn) {
        $btn.removeAttr('disabled');
        $btn.text($btn.attr('data-enabled-text'));
    }
    function disableBtn($btn){
        $btn.attr('disabled','disabled');
        $btn.text($btn.attr('data-disabled-text'));
    }

    var $newsList = Node.one('#news-list');
    var $newsTitleInput = Node.one('#news-title-input');
    var newsContentEditor = initUEditor('ueditor');
    var $newsPublishBtn = Node.one('#news-publish-btn');
    var $newsCreateBtn = Node.one('#news-create-btn');
    var $newsSaveDraftBtn = Node.one('#news-draft-btn');
    var currentNews = null;

    // create news
    $newsCreateBtn.on('click', function() {
        if (currentNews && isCurrentNewsModified()) {
            confirm('modified. save?');

        } else {
            NewsManager.create()
                .then(function(news){
                    setCurrentNews(news);
                    addNewsToNewsList(news);
                    enableEditors();
                },function(err){

                });
        }
    });

    // publish news
    $newsPublishBtn.on('click', function(event) {
        if (!currentNews || !isCurrentNewsModified()) return;

        var modifiedNews = NewsManager.copy(currentNews); 
        modifiedNews.content = newsContentEditor.getContent();
        modifiedNews.title = $newsTitleInput.val();
        disableBtn($newsPublishBtn);
        NewsManager.save(modifiedNews)
            .then(function(res){
                setCurrentNews(res);
                enableBtn($newsPublishBtn);
            },function(err){
                console.log(err);
                enableBtn($newsPublishBtn);
            });
    });

    // save draft
    $newsSaveDraftBtn.on('click', function(){
        disableBtn($newsSaveDraftBtn);
        setTimeout(function(){
            enableBtn($newsSaveDraftBtn);
        },2000);
    });

    // set news for edition
    $newsList.delegate('click', '.news-list__item', function(event){
        var newsId = Node(event.target).attr('data-id').slice(1,-1);
        NewsManager.get(newsId)
            .then(function(news){
                enableEditors();
                setCurrentNews(news);
            },function(err){
                console.log(err);
            });
    });
    Tooltip.init();
    window.Tooltip = Tooltip;

});