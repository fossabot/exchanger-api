const mongoose = require('mongoose');
const Schema = mongoose.Schema;
if (mongoose.connection.readyState === 0)
    mongoose.connect(require('../connection-config.js'))
        .catch(err => {
            console.error('mongoose Error', err)
        });



let HistoryAdminActionsSchema = new Schema({

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

HistoryAdminActionsSchema.pre('save', (next)=> {
    this.updatedAt = Date.now();
    next();
});

HistoryAdminActionsSchema.pre('update', ()=> {
    this.constructor.update({_id: this._id}, { $set: { updatedAt: Date.now() } });
});

HistoryAdminActionsSchema.pre('findOneAndUpdate', ()=> {
    this.constructor.update({_id: this._id}, { $set: { updatedAt: Date.now() } });
});



/** @name db.HistoryAdminActions */
module.exports = mongoose.model('HistoryAdminActions', HistoryAdminActionsSchema);
