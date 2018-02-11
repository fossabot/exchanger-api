"use strict";
const Promise = require("bluebird");

class AWS_S3 {
    constructor(opt) {
        this.AWS = require('aws-sdk');
        this.key = opt.key;
        this.secret = opt.secret;
        this.bucket = opt.bucket;
        this.region = opt.region;
        this.dir = opt.defaultDir.replace(new RegExp('/', 'g'), '-') || 'files';
        this.path = 'https://s3-' + opt.region + '.amazonaws.com/' + opt.bucket + '/' + this.dir + '/';
        this.AWS.config.update({accessKeyId: this.key, secretAccessKey: this.secret});
    }

    upload(file_name, buffer, opt) {
        if (!opt) opt = {};
        if (!opt.dir) {
            opt.dir = this.dir;
            opt.path = this.path;
        }
        else {
            opt.path = this.path.replace(this.dir, opt.dir);
        }
        return new Promise((resolve, reject) => {
            if (!file_name) return reject({
                success: false,
                err: 'upload file_name false',
            });
            if (!buffer) return reject({
                success: false,
                err: 'upload buffer false',
            });

            let s3 = new this.AWS.S3();
            s3.putObject({
                Bucket: this.bucket,
                Key: opt.dir + '/' + file_name,
                Body: buffer,
                ACL: 'public-read'
            }, (err, res) => {
                if (err)
                    return reject({
                        success: false,
                        err: err,
                        error: err.message
                    });

                return resolve && resolve({
                    success: true,
                    url: opt.path + file_name,
                    filename: file_name,
                    attach_path: opt.dir + '/' + file_name,
                    res: res
                    // file: file
                });

            });
        }).timeout(1000 * 60 * 5, 'Upload timeout'); // 5 min

    }

    deleteFilesByUrl(urls) {
        return new Promise((resolve, reject) => {
            if (!urls || typeof urls !== 'object') return reject({
                success: false,
                err: 'urls is not correct',
            });
            let objects_arr = [];

            for (let i in  urls) {
                if (urls.hasOwnProperty(i) && urls[i] && urls[i] !== '') {
                    let key = urls[i].substring((urls[i].indexOf('/' + this.bucket + '/') + ('/' + this.bucket + '/').length));
                    if (key && key !== '')
                        objects_arr.push({Key: key});
                }

            }
            if (objects_arr.length === 0) return reject({
                success: false,
                err: 'urls is not found keys(storage)',
            });
            let s3 = new this.AWS.S3();
            s3.deleteObjects({
                Bucket: this.bucket,
                Delete: {
                    Objects: objects_arr,
                    Quiet: true
                }
            }, (err, res) => {
                if (err)
                    return reject({
                        success: false,
                        err: err,
                        error: err.message
                    });

                return resolve({success: true, res});
            });
        });
    }

    upload_json(file_name, json) {
        let buffer = new Buffer.from(JSON.stringify(json));
        return this.upload(file_name, buffer, {dir: 'json_files'})
    }

}

module.exports = AWS_S3;