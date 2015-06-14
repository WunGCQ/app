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
    unstick: '取消置顶',
    confirm: '确定',
    cancel: '取消',
    selectAvatar: '选择头像',
    edit: '修改',
    delete: '删除'
};
var status = {
    publishing: '发布中..',
    submitting: '提交中..',
    saving: '保存中..',
    sticking: '置顶中..',
    sticked: '已置顶',
    applying: '应用中...'
};

// section specified
var news = {
    category: 'news',
    categoryLabel: '新闻',
    title: '新闻标题', // 创建新闻的默认标题.
    content: '新闻内容',
    latest: '最近新闻推荐',
    listTitle: '新闻列表',
    groupSelectorLabel: '新闻类别:',
    groupsKey: ['default', 'school'],
    groups: {
        default: '学院新闻',
        school: '校际新闻',
        job: '实习就业'
    },
    publishedAt: '发布日期:'
};
var announcement = {
    category: 'announcement',
    categoryLabel: '通告',
    title: '通告标题', // 创建新闻的默认标题.
    content: '通告内容',
    latest: '最近通告',
    listTitle: '通告列表',
    groupSelectorLabel: '通告类别:',
    groupsKey: ['default', 'school', 'job'],
    groups: {
        default: '学院通告',
        school: '校际通告',
        job: '实习就业'
    },
    publishedAt: '发布日期:'
};

var faculty = {
    category: 'faculty',
    categoryLabel: '人员管理',
    galleryLabel: '人物画廊',
    editorTitle: '人物卡片',
    name: '姓名',
    role: '职位',
    title: '头衔',
    description: '简介',
    teacher: '教师',
    student: '学生',
    leader: '学院领导',
    profession: '专业教师',
    french: '法语教师'
};

var components = {
    publicLinks: {
        header: [{
            name: sections.overview,
            link: '#',
            subs: [{
                name: '学院简介',
                url: '#'
            }, {
                name: '学院领导',
                url: '#'
            }, {
                name: '学院大事记',
                url: '#'
            }, {
                name: '行政人员',
                url: '#'
            }]
        }, {
            name: '通知公告',
            url: '#',
            subs: [{
                name: '毕设答辩',
                url: '#'
            }, {
                name: '实习就业',
                url: '#'
            }, {
                name: '学校通知',
                url: '#'
            }, {
                name: '学院通知',
                url: '#'
            }, {
                name: '下载服务',
                url: '#'
            }]
        }, {
            name: '科学研究',
            url: '#',
            subs: [{
                name: '科研项目',
                url: '#'
            }, {
                name: '联合实验室',
                url: '#'
            }, {
                name: '科研成果',
                url: '#'
            }, {
                name: '产学研合作',
                url: '#'
            }]
        }, {
            name: '学院新闻',
            url: '/news'
        }, {
            name: '师资队伍',
            url: '#',
            subs: [{
                name: '专业教师',
                url: '#'
            }, {
                name: '法语教师',
                url: '#'
            }]
        }, {
            name: '招生就业',
            url: '#',
            subs: [{
                name: '招生工作',
                url: '#'
            }, {
                name: '就业指导',
                url: '#'
            }, {
                name: '毕业生风采',
                url: '#'
            }]
        }, {
            name: '交流合作',
            url: '#',
            subs: [{
                name: '国际交流',
                url: '#'
            }, {
                name: '企业合作',
                url: '#'
            }]
        }, {
            name: '人才培养',
            url: '#',
            subs: [{
                name: '本科生培养',
                url: '#'
            }, {
                name: '工程师培养',
                url: '#'
            }]
        }, {
            name: '学生工作',
            url: '#',
            subs: [{
                name: '学生工作办公室',
                url: '#'
            }, {
                name: '分团委',
                url: '#'
            }, {
                name: '学生会',
                url: '#'
            }, {
                name: '研究生会',
                url: '#'
            }]
        }, {
            name: '党建工作',
            url: '#',
            subs: [{
                name: '组织机构',
                url: '#'
            }, {
                name: '党建公告',
                url: '#'
            }, {
                name: '基层党建',
                url: '#'
            }, {
                name: '学习园地',
                url: '#'
            }]
        }]
    }
};

var feedbacks = {
    succeeded: '操作成功',
    failed: '操作失败'
};

zh.sections = sections;
zh.actions = actions;

zh.news = news;
zh.announcement = announcement;
zh.faculty = faculty;

zh.components = components;
zh.status = status;
zh.feedbacks = feedbacks;

zh.LANG = 'zh-cmn-Hans'; // <html lang=...>
zh.LANG_CODE = 'zh'; // 注入页面，供页面脚本识别当前语言

module.exports = zh;
