const mongoose = require('mongoose');
const config = require('../../modules/config');
const passwordUtils = require('../../modules/passwordUtils');
const Encryption = require('../../modules/encryptionUtils');
const encryptionUtils = new Encryption(config.get('crypto:secret_data'), config.get('crypto:secret_hash'));
const Float = require('mongoose-float').loadType(mongoose, 4);

const Schema = mongoose.Schema;

if (mongoose.connection.readyState === 0)
    mongoose.connect(require('../connection-config.js'))
        .catch(err => {
            console.error('mongoose Error', err)
        });


let UserSchema = new Schema({

    email: {
        type: String,
        unique: true
    },
    emailSha256: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: 'Email address is required',
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    date_of_birth: {
        type: Date,
        default: null
    },


    activeHash: {
        type: String,
        default: passwordUtils.generateToken,
    },
    resetPassword: {
        hash: {
            type: String,
            default: null,
        },
        expiresAt: {
            type: Date,
            default: Date.now
        }
    },
    active: {
        type: Boolean,
        default: false,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    deleted_reason: {
        type: String,
        default: '',
    },
    partner_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    affiliate: {
        rate: {
            type: Float,
            default: 0.00
        },
        link: {
            type: String,
            default: null
        },
        totalReceived: {
            usd: {
                type: Float,
                default: 0.0000
            }
        },
        balance: {
            usd: {
                type: Float,
                default: 0.0000
            }
        },
    },

    label: {
        type: String,
        default: '',
    },
    incorrectPassword: {type: Number, default: 0},
    blockingReason: {type: String, default: ''},
    blockingEndTime: {type: Date, default: Date.now},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});
if (config.get('crypto:status_encrypt_database')) {
    UserSchema.path('email').get(email => {
        return encryptionUtils.decryptAes256cbc(email);
    });

    UserSchema.set('toObject', {getters: true});
}

UserSchema.pre('save', function (next) {

    if (this.isModified('password'))
        this.password = passwordUtils.generateHash(this.password);

    if (this.isModified('email')) {
        this.emailSha256 = encryptionUtils.createSha256(this.email);
        if (config.get('crypto:status_encrypt_database')) {
            this.email = encryptionUtils.encryptAes256cbc(this.email);
        }
    }

    next();
});

UserSchema.methods.comparePassword = function (candidatePassword) {
    let start = new Date().getTime();

    let check = passwordUtils.check(candidatePassword, this.password);
    console.log('passwordUtils.check',(new Date().getTime())-start);
    if (!check) {
        if (this.incorrectPassword < config.get('user:security:maxCntInvalidPass')) {
            console.log('this.incorrectPassword', this.incorrectPassword);
            this.constructor.update({_id: this._id}, {$set: {incorrectPassword: this.incorrectPassword + 1}}).then();
        } else
            this.constructor.update({_id: this._id}, {
                $set: {
                    incorrectPassword: 0,
                    blockingReason: 'Many times the password was entered incorrectly',
                    blockingEndTime: (Date.now() + (60 * 1000 * config.get('user:security:minBlocked')))
                }
            }).then();
    } else {
        if (this.incorrectPassword > 0)
            this.constructor.update({_id: this._id}, {$set: {incorrectPassword: 0, blockingReason: '',}}).then();
    }


    return check;
};
/** @name db.User */
module.exports = mongoose.model('User', UserSchema);