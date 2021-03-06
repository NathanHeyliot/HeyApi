'use strict';

let jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Logs = require('../controllers/LogsController'),
    md5 = require('md5'),
    secret_encrypt = "Rmd8VY3OEFG2tX5Nr2DG3qTjV3M0bXKUrMrg6q0J6LyzYmVgvzD7p0b3OQVEVFF5va9NVc05xfRk3PZR8k2p8OzT4Cjota8FsPupTMXnGlY3jAkOeXEDQlmTY2p5QZUDFVL58vHOnNwAhPMRYwaCwaSCtsQIlEBZxEm4kT3hrj2A9faXr67cBEy2lcYRD1HdPVpzLiZJSoBR85XS9Jwv6vgVXBIE0uaw28AEs5QP15706jnJOSc1eImQo3eiKcle",
    expiration_time = "300d";

exports.submit_auth = function (req, res)
{
    User.find({Email: req.params.user, Password: md5(req.params.password)}, function(err, user)
    {
        console.log(user);

        if(user !== undefined && user !== null && user[0] !== undefined) {
            let token = jwt.sign({
                user_id: user[0]._id, user: req.params.user, password: md5(req.params.password)
            }, secret_encrypt, { expiresIn: expiration_time});
            Logs.setLogs(user[0]._id, req);
            res.json({messages: token, user_id: user[0]._id, language: user[0].Language});
            res.end();
        } else {
            console.log("bad Creditentials !");
            res.json({error: "Bad Creditentials !"});
            res.end();
        }
    })
};

exports.middle_token = function (req, res, next) {
    let token = req.headers['x-access-token'];

    if (req.url.startsWith("/auth", 0) || req.url.startsWith("/callback", 0)) {
        next();
    } else if(token) {
        jwt.verify(token, secret_encrypt, function (err, decoded) {
            if (decoded === undefined) {
                User.findOne({ApiToken: token}, function (err, user) {
                   if(err)
                       console.log(err);
                   if(user !== undefined && user !== null) {
                       next();
                   } else {
                       res.json({message: "Bad Token"});
                       res.end();
                   }
                });
            } else {
                next();
            }
        });
    } else {
        res.json({message: "No token !"});
        res.end();
    }
};

exports.check_token = async function ResolveToken(req) {
    let token = req.headers['x-access-token'];
    let bypass = req.headers['bypass'];

    return new Promise((resolve, reject) => {
        jwt.verify(token, secret_encrypt, function (err, decoded) {
            if(decoded === undefined) {
                User.findOne({ApiToken: token}, function (err, user) {
                    if(err)
                        console.log(err);
                    if(user !== undefined && user !== null) {
                        let decoded = {user_id: user._id, user: user.Email, password: md5(user.Password)};
                        if(bypass === null || bypass === undefined || bypass === 'false')
                            decoded.bypass = false;
                        else
                            decoded.bypass = true;
                        resolve(decoded);
                    } else {
                        reject(err);
                    }
                });
            } else {
                if(bypass === null || bypass === undefined || bypass === 'false')
                    decoded.bypass = false;
                else
                    decoded.bypass = true;
                resolve(decoded);
            }
        });
    });
};