var Record = require('../models/record');
var ModelInterface = require('./model-interface');
var _ = require('lodash');
var Q = require('q');

var conf = {
    opts: {
        population: 'images attachments'
    }
};

function RecordApi(model, c) {
    ModelInterface.call(this, model, c);
}

RecordApi.prototype = _.merge({},ModelInterface.prototype, {
    update: function(id, update){
        console.log('update in record');
        console.log(update);
        update = update || {};
        var defer = Q.defer();
        var images = update.images;

        update.updatedAt = new Date();
        delete update.images;
        delete update.attachments;


        var query = this.model.findByIdAndUpdate(id, update);
        var population = this.conf.opts.population;
        if (population) {
            query.populate(population);
        }
        query.exec()
            .then(function(item) {
                if (images && item.images) {
                    item.images.forEach(function(img, i) {
                        if (images.indexOf(img.url) === -1 && images.indexOf(img.source) === -1) {
                            //imagesShouldBeRemoved.push(item.images.splice(i, 1)[0]);
                            item.images.splice(i, 1)[0].remove();
                        }
                    });
                }
                if (update.content) {
                    item.content = update.content;
                }
                return item.save();
            })
            .then(function(item) {
                console.log('//// get item in update after save.');
                console.log(item);
                defer.resolve(item);
            }, function(err) {
                console.log('/// get error in update item.');
                console.log(err);
                defer.reject(err);
            });
        return defer.promise;
    }
});

// 实例化接口对象
var recordApi = new RecordApi(Record, conf);

module.exports = recordApi;
