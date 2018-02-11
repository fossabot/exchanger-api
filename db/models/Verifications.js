const mongoose = require('mongoose');
const Schema = mongoose.Schema;
if (mongoose.connection.readyState === 0)
    mongoose.connect(require('../connection-config.js'))
        .catch(err => {
            console.error('mongoose Error', err)
        });



let VerificationsSchema = new Schema({

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

VerificationsSchema.pre('save', (next)=> {
    this.updatedAt = Date.now();
    next();
});

VerificationsSchema.pre('update', ()=> {
    this.constructor.update({_id: this._id}, { $set: { updatedAt: Date.now() } });
});

VerificationsSchema.pre('findOneAndUpdate', ()=> {
    this.constructor.update({_id: this._id}, { $set: { updatedAt: Date.now() } });
});



/** @name db.Verifications */
module.exports = mongoose.model('Verifications', VerificationsSchema);
