var en = {};

var sections = {
    home: 'Home',
    overview: 'Overview',
    faculty: 'Faculty',
    recruitment: 'Recruitment',
    cooperation: 'Cooperation',
    party: 'Party',
    news: 'news',
    announcement: 'Announcement',
    setting: 'Settings',
    about: 'About'
};
var actions = {
    add: 'Add',
    publish: 'Publish',
    draft: 'Save draft',
    more: 'More',
    search: 'Search',
    signout: 'Sign out',
    stick: 'Stick',
    unstick: 'Unstick',
    confirm: 'Confirm',
    cancel: 'Cancel',
    selectAvatar: 'Select Avatar',
    edit: 'Edit',
    delete: 'Delete'
};
var status = {
    publishing: 'Publishing...',
    submitting: 'Submitting..',
    saving: 'Saving',
    sticking: 'Sticking',
    sticked: 'Sticked',
    applying: 'Applying...'
};

// section specified
var news = {
    category: 'news',
    categoryLabel: 'News',
    title: 'news title',
    content: 'news content',
    latest: 'Latest news',
    listTitle: 'News List',
    groupSelectorLabel: 'News Group:',
    groupsKey: ['default', 'school'],
    groups: {
        default: 'Default News',
        school: 'School News'
    },
    publishedAt: 'Published At:'
};
var announcement = {
    category: 'announcement',
    categoryLabel: 'Announcement',
    title: 'Announcement title',
    content: 'Announcement content',
    latest: 'Latest Announcements',
    listTitle: 'Announcements List',
    groupSelectorLabel: 'Announcements Group:',
    groupsKey: ['default', 'school'],
    groups: {
        default: 'Default Announcements',
        school: 'School Announcements'
    },
    publishedAt: 'Published At:'
};

var faculty = {
    category: 'faculty',
    categoryLabel: 'Faculty',
    galleryLabel: 'Person Gallery',
    editorTitle: 'Profile Card',
    name: 'Name',
    role: 'Role',
    description: 'Description'
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
            url: '#'
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
    succeeded: 'Succeeded.',
    failed: 'Failed.'
};

en.sections = sections;
en.actions = actions;

en.news = news;
en.announcement = announcement;
en.faculty = faculty;

en.components = components;
en.status = status;
en.feedbacks = feedbacks;

en.LANG = 'en'; // <html lang=en.LANG>
en.LANG_CODE = 'en'; // inject in to page for script reference

module.exports = en;
