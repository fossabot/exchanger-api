const mongoose = require('mongoose');
const Schema = mongoose.Schema;
if (mongoose.connection.readyState === 0)
    mongoose.connect(require('../connection-config.js'))
        .catch(err => {
            console.error('mongoose Error', err)
        });



let AdminsSchema = new Schema({

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

AdminsSchema.pre('save', (next)=> {
    this.updatedAt = Date.now();
    next();
});

AdminsSchema.pre('update', ()=> {
    this.constructor.update({_id: this._id}, { $set: { updatedAt: Date.now() } });
});

AdminsSchema.pre('findOneAndUpdate', ()=> {
    this.constructor.update({_id: this._id}, { $set: { updatedAt: Date.now() } });
});



/** @name db.Admins */
module.exports = mongoose.model('Admins', AdminsSchema);
