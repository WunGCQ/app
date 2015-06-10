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

// 链接
var components = {
};

en.sections = sections;
en.actions = actions;

en.news = news;
en.announcement = announcement;
en.faculty = faculty;

en.components = components;
en.status = status;

en.LANG = 'en'; // <html lang=en.LANG>
en.LANG_CODE = 'en'; // inject in to page for script reference

module.exports = en;
