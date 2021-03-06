const express = require('express');
const path = require('path');
const router = express.Router();
const jade = require('jade');
const API = require('../modules/api').API;

const config = require('../modules/config');

const log = require('../modules/log');
const geoip = require('../modules/geoip');
const error = require('../modules/error/api');


router.use('/', (req, res, next) => {
    req.initTimestamp = (new Date()).getTime();
    let IP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '0.0.0.0';
    IP = IP.replace('::ffff:', '');
    if (IP.split(',').length !== 1) {
        IP = IP.split(',')[0]
    }
    if (IP === '::1') IP = '127.0.0.1';
    let infoIP = geoip(IP);

    req.session.lastUse = new Date();
    if (!req.session.first_ip)
        req.session.first_ip = IP;
    req.session.ip = IP;
    if (config.get('application:server:logs:express')) log.info('Express request: \n\t\tUrl: ' + req.protocol + '://' + req.get('Host') + req.url + '\n\t\tClient: ' + infoIP.ip + '/' + infoIP.counterCode);
    req.infoClient = infoIP;

    // req.infoClient.lang = req.params.lang;
    if (false === infoIP.success) {
        // res.end('{"error":"You IP error","ip":"' + IP + '","support":"support@' + config.get('domain') + '"}');
        // log.error('{express} client dont load page reason:[infoIP] : ', infoIP)
        // blocked not ip
        res.set('charset', 'utf8');
        next();
    } else {
        res.set('charset', 'utf8');
        next();
    }

});


router.all('/api/:method/', (req, res) => {
    if (config.get('application:server:logs:express')) log.info('Call API: ' + req.params.method);
    let param = {...req.query, ...req.body, files: req.files};


    let user = {ip: req.infoClient, session: req.session};
    if (!req.params.method) {
        res.sendStatus(404);
        return res.end && res.end(JSON.stringify({
            error: error.api('method not found', 'param', {method: req.params.method, code: 404}, 0),
            success: false
        }));
    }

    API.call(req.params.method, user, param, 'http').then(result => {
        if (result) {
            res.header("Content-Type", "application/json; charset=utf-8");
            return res.end(JSON.stringify(result));
        }

        return res.end && res.end(JSON.stringify({
            error: error.api('API result of null', 'api', {param: param}, 10),
            success: false
        }));

    }).catch(err => {

        return res.end && res.end(JSON.stringify(err));
    });
});
router.get('/api_docs/', (req, res) => {

    let config_local = {
        server_path: config.get('server_path'),
        api_path: config.get('api_path'),
        domain: config.get('domain'),
        project_name: config.get('project_name'),
        version: config.get('version'),
        commitHash: config.get('git:commitHash'),
        latency_ms : (Math.random()*100).toFixed(0),
        countQueries :(Math.random()*1000).toFixed(0),
        shema: config.get('shema') + '://'
    };
    res.set('Content-Type', 'text/html');
    res.end(jade.renderFile(path.normalize(__dirname+'/../_API/index.jade'), {
        methods: {all: API.docs},
        config: config_local,
        admin: true
    }));
});
module.exports = router;