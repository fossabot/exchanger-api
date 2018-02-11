const AWS_S3 = require('./');
const s3 = new AWS_S3({
    key: '',
    secret: '',
    bucket: 'bucket',
    region: 'us-west-2',
    defaultDir: 'files'
});


// or user config module by (bogdan.medve_dev)
const config = require('../config');

// add to create config
config.set('awsAPI:s3:key', '', true, true);
config.set('awsAPI:s3:secret', '', true, true);
config.set('awsAPI:s3:bucket', 'solusse2', true, true);
config.set('awsAPI:s3:region', 'us-west-2', true, true);
config.set('awsAPI:s3:defaultDir', 'files', true, true);
// add to create config
const AWS_S3 = require('./');


const s3 = new AWS_S3({
    key: config.get('awsAPI:s3:key'),
    secret: config.get('awsAPI:s3:secret'),
    bucket: config.get('awsAPI:s3:bucket'),
    region: config.get('awsAPI:s3:region'),
    defaultDir: config.get('awsAPI:s3:defaultDir')
});
// ----------------------------------------------------
let readyFileName= 'example.file';
let buffer= new Buffer();
return s3.upload(readyFileName, buffer, {dir: 'files'}).then(upload_res => {

    return {upload_res};
}); // upload to s3 server