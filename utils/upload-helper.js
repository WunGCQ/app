var multer = require('multer');
var DEST_PREFIX = __dirname + '/..';
var config = require('../configs/config');
var DEST = config.uploadDest;

var uploadHelper = {};

function detect(req) {
    var query = req.query || {};
    var action = query.action;
    var type = query.type;
    var detection = {};
    switch (action) {
        case 'uploadimage':
        case 'catchimage':
            if (type === 'avatar') {
                detection.dest = DEST.avatars;
                detection.attachmentHolderField ='avatar';
                detection.attachmentHolderFieldType = 'string';
            } else {
                detection.dest = DEST.images;
                detection.attachmentHolderField ='images';
                detection.attachmentHolderFieldType = 'array';
            }
            break;
        case 'uploadfile':
            detection.dest = DEST.attachments;
            detection.attachmentHolderField = 'attachments';
            detection.attachmentHolderFieldType = 'array'
            break;
        default:
            break;
    }
    return detection;
}

uploadHelper.multer = multer({
    dest: DEST_PREFIX + DEST.root,

    // remove the rename func before deploy,
    // because it would overwrite the existed same-named file
    rename: function(fieldname, filename) {
        return filename;
    },
    changeDest: function(dest, req, res) {
        var detection = detect(req);
        return DEST_PREFIX + detection.dest;
    }
});

uploadHelper.expose = function(req, res, next) {
    var detection = detect(req);
    if (detection.dest) {
        req._attachmentDest = detection.dest;
        req._attachmentPath = DEST_PREFIX + detection.dest;
    }
    if (detection.attachmentHolderField) {
        req._attachmentHolderField = detection.attachmentHolderField;
        req._attachmentHolderFieldType = detection.attachmentHolderFieldType;
    }
    next();
};

module.exports = uploadHelper;
