'use strict';

let mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Ranks = mongoose.model('Ranks'),
    Auth = require('./AuthController'),
    Permissions = mongoose.model('Permissions');


exports.getPermissions = function (req, res)
{
    var user_entity = Auth.check_token(req);


    user_entity.then(user_entity => {
        User.findOne({_id: user_entity.user_id}, function (err, User)
        {
            if (err)
            {
                console.log("Error at : " + err);
                res.send(err);
            }

            console.log(User);

            Ranks.findOne({_id: User.RankId}, function (err, Rank) {
                if (err)
                {
                    console.log("Error at : " + err);
                    res.send(err);
                }
                Permissions.findOne({RankId: Rank._id}, function (err, permissions) {
                    if (err)
                    {
                        console.log("Error at : " + err);
                        res.send(err);
                    }
                    res.json(permissions);
                });
            });
        });
    });
};

exports.createPermissions = function (req, res) {
    
};

exports.delete_allPermissions = function (req, res) {
    
};

exports.removePermissions = function (req, res) {
    
};

exports.updatePermissions = function (req, res) {
    
};