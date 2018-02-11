const path = require('path');
const nameGroupAPI = path.basename(__filename, '.js');

const error = require('../../modules/error/api');
const config = require('../../modules/config');
const Encryption = require('../../modules/encryptionUtils');
const encryptionUtils = new Encryption(config.get('crypto:secret_data'), config.get('crypto:secret_hash'));

const db = require('../../db');
const mongoose = require('mongoose');

module.exports = (API, redis) => {

    /** @method loginUseEmail */
    API.register('loginUseEmail', (user, param) => {
        return new Promise((resolve, reject) => {
            if (!param.email || param.email === '') return reject(error.api('Email param', 'api', {}, 0, 934732));
            if (!param.password || param.password === '') return reject(error.api('password param', 'api', {}, 0, 45842348));

            param.email = param.email.replace(/\s/g, '').toLowerCase();
            if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(param.email)) return reject(error.api('Email is not valid', 'api', {}, 0, 214321));
            resolve({email: param.email, password: param.password});
        })

            .then((opt) => {
                return db.User.findOne({emailSha256: encryptionUtils.createSha256(opt.email)})
                    .then(usr => {


                        if (!usr) return Promise.reject(error.api('User is not found', 'api', {}, 0, 241351));
                        let blockedUnix = usr.blockingEndTime && usr.blockingEndTime.getTime ? usr.blockingEndTime.getTime() : 0;
                        let blockedTimeEnd = blockedUnix - new Date().getTime();
                        if (blockedTimeEnd > 0) return Promise.reject(error.api('User blocked wait: ' + (blockedTimeEnd / (1000 * 60)).toFixed(0) + ' min.(' + usr.blockingReason + ')', 'api', {}, 0, 63426324));

                        if (!usr.comparePassword(param.password)) return Promise.reject(error.api('Error password', 'api', {}, 0, 532152));

                        if (usr.deleted) return Promise.reject(error.api('Account deleted', 'api', {}, 0, 53215));
                        if (!usr.active) return Promise.reject(error.api('Account is not active please active', 'api', {}, 0, 235112));
                        user.session.user_auth = true;
                        user.session.user_id = usr._id;
                        return usr;

                        return usr;
                    })
                    .catch(err => {
                        return Promise.reject(error.api(err.message, 'api', {opt}, 0, 53256));
                    });

            })
            .catch(err => {
                console.log(err);
                if (err.apiError) return Promise.reject(err);

                let message = 'not message';
                if (typeof err === "string") message = err;
                if (err && typeof err.message === "string") message = err.message;
                let err_obj = {param: param, err: err};
                return Promise.reject(error.api(message, 'api', err_obj, 1, 532162));
            });
    }, {
        title: 'Login to account with email',
        level: 0,// 0 public,1 user,2 admin,3 server
        description: '',
        group: nameGroupAPI,
        param: [
            {name: 'email', type: "string", title: 'Email account', necessarily: true},
            {name: 'password', type: "string", title: 'password user account', necessarily: true},
        ],
        response: [
            {name: 'data.token', type: "int", title: 'token hash string', default: 'Hfgas3251fsa'},
            {name: 'data.user_id', type: "int", title: 'user id login in account', default: '2'}
        ]
    });
    API.register('registerUseEmail', (user, param) => {
        return new Promise((resolve, reject) => {
            if (!param.email || param.email === '' || /<|>/.test(param.email)) return reject(error.api('Email param', 'api', {}, 0, 214321));
            if (!param.password || param.password === '') return reject(error.api('password param', 'api', {}, 0, 4153215));
            if (!param.first_name || param.first_name === '' || /<|>/.test(param.first_name)) return reject(error.api('first_name param', 'api', {}, 0, 144412));
            if (!param.last_name || param.last_name === '' || /<|>/.test(param.last_name)) return reject(error.api('last_name param', 'api', {}, 0, 4124421));

            if (param.partner_id && !mongoose.Types.ObjectId.isValid(param.partner_id)) return reject(error.api('partner_id param', 'api', {}, 0, 42134123523));


            param.email = param.email.replace(/\s/g, '').toLowerCase();
            if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(param.email)) return reject(error.api('Email is not valid', 'api', {}, 0, 214321));

            resolve({
                email: param.email,
                password: param.password,
                first_name: param.first_name,
                partner_id: param.partner_id,
                last_name: param.last_name
            });
        })

            .then((opt) => {
                return new db.User({
                    email: opt.email,
                    password: opt.password,
                    first_name: opt.first_name,
                    last_name: opt.last_name

                }).save().catch(err => {
                    if (err.code === 11000) return Promise.reject(error.api('Email address already in use', 'api', {}, 0, 11000654));
                    return Promise.reject(error.api(err.message, 'api', {opt}, 0, 67562));
                })
            })
            .catch(err => {
                console.log(err);
                if (err.apiError) return Promise.reject(err);

                let message = 'not message';
                if (typeof err === "string") message = err;
                if (err && typeof err.message === "string") message = err.message;
                let err_obj = {param: param, err: err};
                return Promise.reject(error.api(message, 'api', err_obj, 1, 532162));
            });
    }, {
        title: 'Register a new account by email',
        level: 0,// 0 public,1 user,2 admin,3 server
        description: '',
        group: nameGroupAPI,
        param: [
            {name: 'email', type: "string", title: 'Email account', necessarily: true},
            {name: 'password', type: "string", title: 'password user account', necessarily: true},
            {name: 'first_name', type: "string", title: 'Name user', necessarily: true},
            {name: 'last_name', type: "string", title: 'Surname user', necessarily: true},
        ],
        response: [
            {name: 'data.token', type: "int", title: 'token hash string', default: 'Hfgas3251fsa'},
            {name: 'data.user_id', type: "int", title: 'user id login in account', default: '2'}
        ]
    });

};