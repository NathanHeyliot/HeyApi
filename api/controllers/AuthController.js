'use strict'

let jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    md5 = require('md5'),
    secret_encrypt = "Rmd8VY3OEFG2tX5Nr2DG3qTjV3M0bXKUrMrg6q0J6LyzYmVgvzD7p0b3OQVEVFF5va9NVc05xfRk3PZR8k2p8OzT4Cjota8FsPupTMXnGlY3jAkOeXEDQlmTY2p5QZUDFVL58vHOnNwAhPMRYwaCwaSCtsQIlEBZxEm4kT3hrj2A9faXr67cBEy2lcYRD1HdPVpzLiZJSoBR85XS9Jwv6vgVXBIE0uaw28AEs5QP15706jnJOSc1eImQo3eiKcle",
    expiration_time = "300d";

exports.submit_auth = function (req, res)
{
    User.find({Email: req.params.user, Password: md5(req.params.password)}, function(err, user)
    {
        if(user[0]) {
            var token = jwt.sign({
                user: req.params.user, password: md5(req.params.password)
            }, secret_encrypt, { expiresIn: expiration_time});
            console.log("AUTH : [user : " + req.params.user + ", token : " + token + "]");
            res.json({messages: token, admin: user[0].isAdmin});
            res.end();
        } else {
            console.log("bad Creditentials !");
            res.json({error: "Bad Creditentials !"});
            res.end();
        }
    })
};

exports.middle_token = function (req, res, next) {
    var token = req.headers['x-access-token'];
    if(token) {
        jwt.verify(token, secret_encrypt, function (err, decoded) {
            if (decoded === undefined) {
                res.json({message: "Bad Token"});
                res.end();
            } else {
                next();
            }
        });
    } else if (req.url.startsWith("/auth", 0) || req.url.startsWith("/payloads", 0)) {
            next();
    } else {
        res.json({message: "No token !"});
        res.end();
    }
};