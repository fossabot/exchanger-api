const mongoose = require('mongoose');
const Schema = mongoose.Schema;
if (mongoose.connection.readyState === 0)
    mongoose.connect(require('../connection-config.js'))
        .catch(err => {
            console.error('mongoose Error', err)
        });



let PartnersListSchema = new Schema({

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

PartnersListSchema.pre('save', (next)=> {
    this.updatedAt = Date.now();
    next();
});

PartnersListSchema.pre('update', ()=> {
    this.constructor.update({_id: this._id}, { $set: { updatedAt: Date.now() } });
});

PartnersListSchema.pre('findOneAndUpdate', ()=> {
    this.constructor.update({_id: this._id}, { $set: { updatedAt: Date.now() } });
});



/** @name db.PartnersList */
module.exports = mongoose.model('PartnersList', PartnersListSchema);
