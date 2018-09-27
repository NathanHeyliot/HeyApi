'use strict';

let  mongoose = require('mongoose'),
     Auth = require('../controllers/AuthController'),
     Logs = mongoose.model('Logs');

exports.middle_logs = function (req, res, next) {
    let url = req.url;
    let method = req.method.toUpperCase();

    Promise.all([Auth.check_token(req)]).then(response => {
        let newLogs = new Logs();
        newLogs.User = response[0].user_id;
        newLogs.Url = url;
        newLogs.Method = method;

        newLogs.save(function (err, success) {
            if(err)
                console.log("Error when logging !!!! Details : " + err);
        });
        next();
    });
};