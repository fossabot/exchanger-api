const Encryption = require('./');
const config = require('../config');

config.default('crypto:secret_data', 'insert_your_32_characterKey_here', true, true);
config.set('crypto:secret_hash', 'insert_your_12_character', true, true);
const encryptionUtils = new Encryption(config.get('crypto:secret_data'),config.get('crypto:secret_hash'));

// ====================


let encrypted_string = encryptionUtils.encryptAes256cbc('blabla');
console.log('encrypted_string Aes256cbc',encrypted_string);


let decrypted_string = encryptionUtils.decryptAes256cbc(encrypted_string);
console.log('decrypted_string Aes256cbc',decrypted_string);

let sha256hash_string = encryptionUtils.createSha256('test');
console.log('sha256hash',sha256hash_string);
