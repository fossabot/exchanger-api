const error = require('../error/api.js');
const user = (user) => {
    return new Promise(resolve => {
        if (user.session.user_auth && user.session.user_id)
            resolve({status: true, _id: user.session.user_id});
        else
            resolve({status: false})

    });
};
const admin = (user) => {
    return new Promise(resolve => {
        resolve({status: false});
    });
};

const checkAuth = (level, auth) => {
    return new Promise((resolve, reject) => {
        if (level === 1 && !auth.user.status)
            return reject(error.api('You are not authorized User', 'unauthorized', {
                pos: 'modules/api/auth.js(controller):#1',
                level: level,
                type: 'user'
            }, 0, 40301, 403));

        if (level === 2 && !auth.admin.status)
            return reject(error.api('You are not authorized Admin', 'unauthorized', {
                pos: 'modules/api/auth.js(controller):#2',
                level: level,
                type: 'admin'
            }, 0, 40302, 403));
        resolve(auth);
    });
};
module.exports = {admin: admin, user: user, checkAuth: checkAuth};