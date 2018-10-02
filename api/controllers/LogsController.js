'use strict';

let  mongoose = require('mongoose'),
     Auth = require('../controllers/AuthController'),
     fs = require('fs'),
     Logs = mongoose.model('Logs');


let Reset = "\x1b[0m",
Bright = "\x1b[1m",
Dim = "\x1b[2m",
Underscore = "\x1b[4m",
Blink = "\x1b[5m",
Reverse = "\x1b[7m",
Hidden = "\x1b[8m",

FgBlack = "\x1b[30m",
FgRed = "\x1b[31m",
FgGreen = "\x1b[32m",
FgYellow = "\x1b[33m",
FgBlue = "\x1b[34m",
FgMagenta = "\x1b[35m",
FgCyan = "\x1b[36m",
FgWhite = "\x1b[37m",

BgBlack = "\x1b[40m",
BgRed = "\x1b[41m",
BgGreen = "\x1b[42m",
BgYellow = "\x1b[43m",
BgBlue = "\x1b[44m",
BgMagenta = "\x1b[45m",
BgCyan = "\x1b[46m",
BgWhite = "\x1b[47m";

exports.middle_logs = function (req, res, next) {
    let url = req.url;
    let method = req.method.toUpperCase();

    if (req.url.startsWith("/auth", 0) || req.url.startsWith("/callback", 0)) {
        next();
    } else {
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
    }
};

exports.setLogs = function (user_id, req) {
    let newLogs = new Logs();
    newLogs.User = user_id;
    newLogs.Url = req.url;
    newLogs.Method = req.method.toUpperCase();

    newLogs.save(function (err, success) {
        if(err)
            console.log("Error when logging !!!! Details : " + err);
    });
};

exports.Logs_error = function (message) {
    console.log(FgRed + message);
};

exports.Logs_info = function (message) {
    console.log(FgCyan + message);
};

exports.Logs_success = function (message) {
    console.log(FgGreen + message);
};