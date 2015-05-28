var zh = {};

var sections = {
    home: '首页',
    overview: '学院概况',
    faculty: '师资力量',
    recruitment: '招生工作',
    cooperation: '交流合作',
    party: '党建工作',
    news: '新闻中心',
    announcement: '通告',
    setting: '设置',
    about: '关于'
};
var actions = {
    add: '添加',
    publish: '发布',
    draft: '存为草稿',
    more: '更多',
    search: '搜索',
    signout: '退出',
    stick: '置顶',
    unstick: '取消置顶'
};
var status = {
    publishing: '发布中..',
    saving: '保存中..',
    sticking: '置顶中..',
    sticked: '已置顶',
    applying: '应用中...'
};

// section specified
var news = {
    title: '新闻标题', // 创建新闻的默认标题.
    content: '新闻内容',
    latest: '最近新闻推荐',
    listTitle:'新闻列表',
    groupSelectorLabel: '新闻类别:',
    groupsKey: ['default', 'school'],
    groups: {
        default: '学院新闻',
        school: '校际新闻'
    },
    publishedAt: '发布日期:'
};
var components = {
};
zh.sections = sections;
zh.actions = actions;
zh.news = news;
zh.components = components;
zh.record = news;
zh.status = status;

zh.LANG = 'zh-cmn-Hans'; // <html lang=...>
zh.LANG_CODE = 'zh'; // 注入页面，供页面脚本识别当前语言

module.exports = zh;
