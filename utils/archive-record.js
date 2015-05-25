function makeDateMeta(record) {
    var date = new Date(record.createdAt);
    var metas= {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        date: date.getDate(),
        value: date.valueOf()
    };
    return metas;
}
function shouldRecordInGroup(record, group) {
    var _metas = group.metas;
    var metas = makeDateMeta(record);
    return _metas.year === metas.year && _metas.month === metas.month;
}
module.exports = function(records) {
    var len = records.length;
    var archives = [];
    var record = null;
    var i;

    for(i = 0; i < len; i++){
        record = records[i];
        if(archives.length === 0 || !shouldRecordInGroup(record, archives[archives.length - 1])){
            archives.push({
                metas: makeDateMeta(record),
                list: [record]
            });
        }else{
            archives[archives.length - 1].list.push(record);
        }
    }
    return archives;
};