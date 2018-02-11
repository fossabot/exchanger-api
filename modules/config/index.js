'use strict';
/**
 * Created by bogdanmedvedev on 11.01.18.
 */

const DIR_CONFIG = 'config';
const NAME_CONFIG = 'app_config';

console.log('Server used config: '+NAME_CONFIG);
const fs = require('fs'),
    path = require('path'),
    nconf = require('nconf'),
    error = require('../../modules/error'),
    log = require('../../modules/log'),
    _path_config = path.normalize(__dirname + '../../../' + DIR_CONFIG + '/');
// check dir and  create dir config
if (!fs.existsSync(path.normalize(__dirname + '../../../' + DIR_CONFIG)))
    fs.mkdirSync(path.normalize(__dirname + '../../../' + DIR_CONFIG));

let statusSaveConfig = true;

function reloadConfig() {

    try {
        if (statusSaveConfig) {
            nconf.argv().env().file({file: _path_config + '' + NAME_CONFIG + '.json'});
        }
    } catch (e) {
        setTimeout(reloadConfig, 5000);
        log.error('File ' + NAME_CONFIG + '.json [format Error]:', e);
    }

}

reloadConfig();

function saveConfig() {
    if (model.get('server:server:logs:' + NAME_CONFIG + '')) log.info('[' + NAME_CONFIG + ' save] starting...');
    statusSaveConfig = false;
    nconf.save(function (err) {
        if (err) return new error('core/createConfig.js/nconf.save :' + err);
        if (model.get('server:server:logs:' + NAME_CONFIG + '')) log.info('[' + NAME_CONFIG + ' save] saved and read new ' + NAME_CONFIG + ' starting...');

        fs.readFile(_path_config + '' + NAME_CONFIG + '.json', function (err, data) {
            if (model.get('server:server:logs:' + NAME_CONFIG + '')) log.info('[' + NAME_CONFIG + ' save] saved and JSON.parse new ' + NAME_CONFIG + ' starting...');
            if (err) return new error('core/createConfig.js/fs.readFile :' + err);
            try {
                let res = JSON.parse(data);
                if (model.get('server:server:logs:' + NAME_CONFIG + '')) log.info('[' + NAME_CONFIG + ' save] saved and read new app_config to JSON');
                if (model.get('server:server:logs:' + NAME_CONFIG + '')) console.log('[' + NAME_CONFIG + ']', res);
                statusSaveConfig = true;
            } catch (e) {
                log.error('File ' + NAME_CONFIG + '.json [Error read format]: see ' + NAME_CONFIG + '.json saveConfig' + e);
            }
        });
    });
}

const model = {
    set: (param, value, testWrite, dontSave) => {
        if (model.get('server:server:logs:' + NAME_CONFIG + '')) log.info('[' + NAME_CONFIG + ' set] Param:' + param + ', Value:' + value + ', testParam:' + testWrite + ',dontSave:' + dontSave);
        if (testWrite) {
            if (!nconf.get(param)) {
                nconf.set(param, value);
                return true;
            }
            return false;
        }
        nconf.set(param, value);
        if (!dontSave) saveConfig();
        return true;
    },
    get: function (param) {
        var value = nconf.get(param);
        if (param !== 'server:server:logs:' + NAME_CONFIG + '' && model.get('server:server:logs:' + NAME_CONFIG + '')) log.info('[' + NAME_CONFIG + ' get] Param:' + param + ', Value:' + value);
        return value
    },
    save: saveConfig,
    rereadConfig: reloadConfig,
    getAllToJsonConfig: (callback) => {
        if (err) callback(err, null);
        fs.readFile(_path_config + '' + NAME_CONFIG + '.json', (err, data) => {
            if (err) callback(err, null);
            try {
                callback(null, JSON.parse(data));
            } catch (e) {
                callback('File ' + NAME_CONFIG + '.json [Error read format]: see ' + NAME_CONFIG + '.json getAllToJsonConfig' + e, null);

            }
        });
    },
    default: (param, value, resave) => {
        return model.set(param, value, !resave, true);
    }
};
module.exports = exports = model;
require('./createConfig'); // init create conf
if (fs.existsSync(_path_config + 'default.' + NAME_CONFIG + '.js'))
    require(_path_config + 'default.' + NAME_CONFIG + '.js')(model); // init create conf


setTimeout(() => {
    const chokidar = require('chokidar');
    const watcher = chokidar.watch(_path_config + '' + NAME_CONFIG + '.json', {
        ignored: /[\/\\]\./,
        persistent: true
    });
    watcher.on('add', function () {
        if (model.get('server:server:logs:' + NAME_CONFIG + '')) log.info('[' + NAME_CONFIG + ' watcher] .on("add")');
        reloadConfig();
    }).on('change', function () {
        if (model.get('server:server:logs:' + NAME_CONFIG + '')) log.info('[' + NAME_CONFIG + ' watcher] .on("change")');
        reloadConfig();
    });
}, 1000 * 30); // watcher after 30s
