const mongoose = require('mongoose');
const Schema = mongoose.Schema;
if (mongoose.connection.readyState === 0)
    mongoose.connect(require('../connection-config.js'))
        .catch(err => {
            console.error('mongoose Error', err)
        });



let PayApiConfigSchema = new Schema({

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

PayApiConfigSchema.pre('save', (next)=> {
    this.updatedAt = Date.now();
    next();
});

PayApiConfigSchema.pre('update', ()=> {
    this.constructor.update({_id: this._id}, { $set: { updatedAt: Date.now() } });
});

PayApiConfigSchema.pre('findOneAndUpdate', ()=> {
    this.constructor.update({_id: this._id}, { $set: { updatedAt: Date.now() } });
});



/** @name db.PayApiConfig */
module.exports = mongoose.model('PayApiConfig', PayApiConfigSchema);
