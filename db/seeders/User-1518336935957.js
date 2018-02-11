const mongoose = require('mongoose');
const db = require('../index');
'use strict';

module.exports = {
    up: function () {
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.


          For Example


          return db.User.create([])
        */
        return db.User.create([
            {
                first_name: 'Name',
                last_name: 'Surname',
                email: 'test1@gmail.com',
                password: 'qweqwe',
                affiliate: {
                    rate: 0.001,
                    balance: {
                        usd: 0.12
                    }
                }
            }, {
                first_name: 'Name',
                last_name: 'Surname',
                email: 'test2@gmail.com',
                password: 'qweqwe',
                affiliate: {
                    rate: 0.3,
                    balance: {
                        usd: 2.002
                    }
                }
            }, {
                first_name: 'Name',
                last_name: 'Surname',
                email: 'test3@gmail.com',
                password: 'qweqwe',
                affiliate: {
                    rate: 30,
                    balance: {
                        usd: 2.012
                    }
                }
            }
        ])
    },

    down: function () {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.

          Example:

          return db.User.remove({})
        */
        return db.User.remove({});
    }
};
