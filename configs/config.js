;'use strict';

exports.db = {
    connectionUrl: 'mongodb://localhost:27017/izone',
    options:{
        server:{
            socketOptions:{
                keepAlive: 1
            }
        } 
    }
};

exports.auth = {
    secretToken: 'secretToken',
    expiresInMinutes: 600
};


exports.server = {
    address: "127.0.0.1",
    port: process.env.PORT || 6005
};
exports.server.domain = 'http://' + exports.server.address + ':' + exports.server.port;


