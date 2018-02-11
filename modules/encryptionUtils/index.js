'use strict';
const crypto = require('crypto');

class aes_crypto {
    constructor(secret_key,hash_secret) {

        if (secret_key.length !== 32)
            throw new Error('aes_crypto error param init secret_key.length !== 32');
        this.ENCRYPTION_KEY = secret_key;
        if (hash_secret.length < 12)
            throw new Error('aes_crypto error param init hash_secret.length < 12');
        this.HASH_KEY = hash_secret;

        //aes
        this.iv_length_aes = 16;
        this.algoritm_aes = 'aes-256-cbc';
    }

    encryptAes256cbc(text) {
        let iv = crypto.randomBytes(this.iv_length_aes);
        let cipher = crypto.createCipheriv(this.algoritm_aes, Buffer.from(this.ENCRYPTION_KEY), iv);
        let encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

        return iv.toString('hex') + ':' + encrypted.toString('hex');
    }

    decryptAes256cbc(text) {
        let textParts = text.split(':');
        if(textParts.length !== 2) return text;
        let iv = new Buffer(textParts.shift(), 'hex');
        let encryptedText = Buffer.from(textParts.join(':'), 'hex');
        let decipher = crypto.createDecipheriv(this.algoritm_aes, Buffer.from(this.ENCRYPTION_KEY), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }

    createSha256(text) {
        return crypto.createHmac('sha256', this.HASH_KEY).update(text).digest('hex');
    }
}


module.exports = aes_crypto;