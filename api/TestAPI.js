const path = require('path');
const nameGroupAPI = path.basename(__filename, '.js');


const db = require('../db');

module.exports = (API, redis) => {
    API.register('testAPI', (user, param) => {
        return Promise.resolve({ok: 1})
    }, {
        title: 'Test API',
        level: 0,// 0 public,1 user,2 admin,3 server
        description: '',
        group: nameGroupAPI,
        param: [],
        response: [{name: 'data.ok', type: "int", title: 'ok==1', default: '1'}]
    });
    API.register('testAPI_db', (user, param) => {
        return db.News.find().then(res => {
            return {result_db: res}
        });
    }, {
        title: 'Test API',
        level: 0,// 0 public,1 user,2 admin,3 server
        description: '',
        group: nameGroupAPI,
        param: [],
        response: [{name: 'data.ok', type: "int", title: 'ok==1', default: '1'}]
    });
};