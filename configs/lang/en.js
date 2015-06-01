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
    unstick: 'Unstick'
};
var status = {
    publishing: 'Publishing...',
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
    listTitle:'News List',
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
    listTitle:'Announcements List',
    groupSelectorLabel: 'Announcements Group:',
    groupsKey: ['default', 'school'],
    groups: {
        default: 'Default Announcements',
        school: 'School Announcements'
    },
    publishedAt: 'Published At:'
};
var components = {
};
en.sections = sections;
en.actions = actions;
en.news = news;
en.announcement = announcement;
en.components = components;
en.record = news;
en.status = status;

en.LANG = 'en'; // <html lang=en.LANG>
en.LANG_CODE = 'en'; // inject in to page for script reference

module.exports = en;
