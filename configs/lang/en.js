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
    about: 'About'
};
var actions = {
    add: 'Add',
    publish: 'Publish',
    publishing: 'Publishing...',
    draft: 'Save draft',
    drafting: 'Saving',
    more: 'More',
    search: 'Search',
    setting: 'Settings',
    signout: 'Sign out'
};
var news = {
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
var components = {
};
en.sections = sections;
en.actions = actions;
en.news = news;
en.components = components;
en.record = news;

en.LANG = 'en'; // <html lang=en.LANG>
en.LANG_CODE = 'en'; // inject in to page for script reference


module.exports = en;