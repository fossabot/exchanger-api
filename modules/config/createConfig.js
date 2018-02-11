/**
 * Created by bogdanmedvedev on 13.06.16.
 */

'use strict';
const config = require('./index');
config.default('git:commitHash', '000000');
config.default('version', '1.0.01');
config.default('developers', [{
    name: 'Bogdan Medvedev',
    github: 'https://github.com/medve-dev',
    mail: 'bogdan.m@vidax.com'
}]);
config.save();


const git = require('git-rev');
git.short((str) => {

    if(config.get('git:commitHash') !== str) {
        let version = config.get('version');
        let ver = version.split('.');
        if (+ver[2] < 999) {
            ver[2] = +ver[2];
            ver[2]++;
            if (ver[2] < 10) ver[2] = '00' + '' + ver[2];
            else if (ver[2] < 100) ver[2] = '0' + '' + ver[2];
        } else {
            if (+ver[1] < 99) {
                ver[1] = +ver[1];
                ver[1]++;
                if (ver[1] < 10) ver[1] = '0' + '' + ver[1];

            } else {
                ver[0]++;
                ver[1] = '01';
            }
            ver[2] = '001';
        }


        config.default('version', ver.join('.'), !0);
    }
    config.default('git:commitHash', str, !0);

    setTimeout(function () {
        config.save();
    }, 500)
});