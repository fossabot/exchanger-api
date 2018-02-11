'use strict';
const crypto = require('crypto');

module.exports.generateHash = (password) => {
    let length_salt = 16;
    let salt = crypto.randomBytes(Math.ceil(length_salt / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, length_salt);

    return '$sha256$' + length_salt + '$' + salt + '' + crypto.createHmac('sha256', salt).update(password).digest('hex');
};

module.exports.check = (password, hash) => {
    let hashArr = hash.split("$");
    let length_salt = parseInt(hashArr[2], 10);
    let salt = hashArr[3].substring(0, length_salt);
    let hash_str = hashArr[3].substring(length_salt);
    return (crypto.createHmac('sha256', salt).update(password).digest('hex') === hash_str);
};

module.exports.generateToken = () => {
    return crypto.randomBytes(20).toString('hex');
};


module.exports.generateTokenUnic = () => {
    return crypto.createHash('sha1').update((new Date().getTime()) + crypto.randomBytes(5).toString('hex')).digest('hex')
};
