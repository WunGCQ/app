'use strict';
var _ = require('underscore');

// mongolab
var MONGODB_CONN = 'mongodb://ecpkn:ecpkn123456@ds041671.mongolab.com:41671/ecpkn';

exports.db = {
    connectionUrl: process.env.MONGODB_CONN || 'mongodb://localhost:27017/ecpkn',
    options: {
        server: {
            socketOptions: {
                keepAlive: 1
            }
        }
    },
    collections: {
        attachment: {},
        record: {
            news: {
                groups: ['default', 'school']
            },
            announcement: {
                groups: ['default', 'school', 'job', 'download']
            }
        },
        person: {
            teacher: {
                groups: ['leader', 'profession', 'french']
            },
            student: {

            }
        }
    }
};
exports.db.metas = {};
exports.db.metas.RECORD_CATEGORIES = _.keys(exports.db.collections.record);
exports.db.metas.RECORD_GROUPS = _.union.apply(null,
    _.map(exports.db.metas.RECORD_CATEGORIES,
        function(category) {
            return exports.db.collections.record[category].groups;
        }));

exports.db.metas.PERSON_CATEGORIES = _.keys(exports.db.collections.person);
exports.db.metas.PERSON_GROUPS = _.union.apply(null,
    _.map(exports.db.metas.PERSON_CATEGORIES,
        function(category) {
            return exports.db.collections.person[category].groups;
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
    },
    default: {
        LIMIT: 20,
        SKIP: 0
    }
};

exports.server.domain = 'http://' + exports.server.address + ':' + exports.server.port;
