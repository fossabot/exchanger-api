const path = require('path');
const session = require('koa-session');
const Koa = require('koa');
const app = new Koa();
const config = require('./modules/config');
const db = require('./db');

const mongoose = require('mongoose');
const MongooseStore = require('koa-session-mongoose');
const helmet = require('koa-helmet');

const cors = require('@koa/cors');
const co_body = require('co-body');
const compress = require('koa-compress');
const bodyParser = require('koa-bodyparser');
app.keys = [config.get('server:session:secret')];
app.use(compress({
    filter: function (content_type) {
        return /text/i.test(content_type)
    },
    threshold: 2048,
    flush: require('zlib').Z_SYNC_FLUSH
}));
app.use(helmet());

app.use(cors({
    origin: '*',
    allowMethods: 'GET, POST, PUT, DELETE',
    allowHeaders: 'Origin, X-Requested-With, Content-Type, Token, Locale,auth_data'
}));
app.use(session({
    key: config.get('server:session:name'),
    maxAge: config.get('server:session:ttl_hours') * 60 * 60 * 1000,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false,
    store: new MongooseStore({
        connection: mongoose,
        expires: config.get('server:session:ttl_hours') * 60 * 60
    })
}, app));
const jade = require('jade');
const API = require('./modules/api').API;
const log = require('./modules/log');
const geoip = require('./modules/geoip');
const error = require('./modules/error/api');

const Router = require('koa-router');

let router = new Router();
router.param('methodAPI', async (name, ctx, next) => {
    ctx.methodAPI = name;
    if (!ctx.methodAPI) return ctx.status = 404;
    return next();
}).all('/v1/api/:methodAPI/',bodyParser({enableTypes:['json']}), async ctx => {
    ctx.initTimestamp = (new Date()).getTime();
    let IP = ctx.ip || ctx.headers['x-forwarded-for'] || '0.0.0.0';
    IP = IP.replace('::ffff:', '');
    if (IP.split(',').length !== 1) {
        IP = IP.split(',')[0]
    }
    if (IP === '::1') IP = '127.0.0.1';
    let infoIP = geoip(IP);

    ctx.session.lastUse = new Date();
    if (!ctx.session.first_ip)
        ctx.session.first_ip = IP;
    ctx.session.ip = IP;
    if (config.get('application:server:logs:express')) log.info('Express request: \n\t\tUrl: ' + ctx.protocol + '://' + ctx.get('Host') + ctx.url + '\n\t\tClient: ' + infoIP.ip + '/' + infoIP.counterCode);
    ctx.infoClient = infoIP;

    let post_data = ctx.request.body;
    let param = {...ctx.query, ...post_data, files: ctx.files};
    let user = {ip: ctx.infoClient, session: ctx.session};
    ctx.body = 'SOON-----'

});
app.use(router.routes());

app.listen(config.get('server:port') || 3001);