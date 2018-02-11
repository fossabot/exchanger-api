const mongoose = require('mongoose');
const Schema = mongoose.Schema;
if (mongoose.connection.readyState === 0)
    mongoose.connect(require('../connection-config.js'))
        .catch(err => {
            console.error('mongoose Error', err)
        });



let CoursesSchema = new Schema({

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

CoursesSchema.pre('save', (next)=> {
    this.updatedAt = Date.now();
    next();
});

CoursesSchema.pre('update', ()=> {
    this.constructor.update({_id: this._id}, { $set: { updatedAt: Date.now() } });
});

CoursesSchema.pre('findOneAndUpdate', ()=> {
    this.constructor.update({_id: this._id}, { $set: { updatedAt: Date.now() } });
});



/** @name db.Courses */
module.exports = mongoose.model('Courses', CoursesSchema);
