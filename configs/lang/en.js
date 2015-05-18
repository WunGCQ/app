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
    latest: 'Latest news'
};
var components = {
    newsList: 'News List'
};
en.sections = sections;
en.actions = actions;
en.news = news;
en.components = components;

en.LANG = 'en'; // <html lang=en.LANG>
en.LANG_CODE = 'en'; // inject in to page for script reference


module.exports = en;