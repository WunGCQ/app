'use strict';
var _ = require('underscore');

exports.db = {
    connectionUrl: 'mongodb://localhost:27017/ecpkn',
    options: {
        server: {
            socketOptions: {
                keepAlive: 1
            }
        }
    },
    collections: {
        news: {
            groups: ['default', 'school']
        },
        announcement: {
            groups: []
        }
    }
};
exports.db.collections.CATEGORIES = _.keys(exports.db.collections);
exports.db.collections.GROUPS = _.union.apply(null,
    _.map(exports.db.collections.CATEGORIES,
        function(category) {
            return exports.db.collections[category].groups;
        }));

exports.auth = {
    secretToken: 'secretToken',
    expiresInMinutes: 600
};

exports.server = {
    address: '127.0.0.1',
    port: process.env.PORT || 6005
};

exports.uploadDest = {
    'root': '/statics/uploads/',
    'images': '/statics/uploads/images/',
    'attachments': '/statics/uploads/attachments/',
    'avatars': '/statics/uploads/avatars/'
};

exports.app = {
    record: {
        PER_PAGE: 10,
        LIMIT: 20,
        SKIP: 0
    }
};

exports.server.domain = 'http://' + exports.server.address + ':' + exports.server.port;
