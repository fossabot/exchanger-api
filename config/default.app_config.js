/**
 * Created by bogdanmedvedev on 13.06.16.
 */

'use strict';
const random = require('../modules/random');
module.exports = (config) => {
    // var portfinder = require('portfinder');
    config.default('mongodb:uri', 'mongodb://user:pass@localhost:27017/test');



    config.default('project_name', 'Exchanger');
    config.default('version', '1.801.02');
    config.default('shema', 'http');
    config.default('domain', 'localhost:3001');
    config.default('server_path', '/');
    // config.default('server_path', '/service/'); // nginx conf
    config.default('api_path', 'v1/api/');


    config.default('server:port', 3010);
    config.default('server:session:secret', random.str(12, 15));
    config.default('server:session:ttl_hours', 48);
    config.default('server:session:name', random.str(6, 8));
    config.default('server:api:timeout', 10);

    config.default('user:security:maxCntInvalidPass',  10);
    config.default('user:security:minBlocked',  5); // 5 min
    config.default('crypto:status_encrypt_database', false); // status
    config.default('crypto:secret_data',  random.str(32, 32)); // === 32 character
    config.default('crypto:secret_hash', random.str(12, 20)); // > 32 character
    config.default('redis:port', 6379);
    config.default('redis:host', '127.0.0.1');
    config.default('redis:password', '');
    config.default('redis:database', 0);
    config.default('redis:status', false);

    config.default('awsAPI:s3:key', '');
    config.default('awsAPI:s3:secret', '');
    config.default('awsAPI:s3:bucket', 'bucketExchange');
    config.default('awsAPI:s3:region', 'us-west-2');
    config.default('awsAPI:s3:defaultDir', 'files');

    config.save();
};