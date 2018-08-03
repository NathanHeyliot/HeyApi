'use strict';

let mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Ranks = mongoose.model('Ranks'),
    Auth = require('./AuthController'),
    Permissions = mongoose.model('Permissions');


exports.getPermissions = function (req, res)
{
    var user_entity = Auth.check_token(req);

    User.findOne({_id: user_entity._id}, function (err, User)
    {
        if (err)
        {
            console.log("Error at : " + err);
            res.send(err);
        }
        if(User !== undefined && User !== null) {
            Ranks.findOne({_id: User.RankId}, function (err, Rank) {
                if (err)
                {
                    console.log("Error at : " + err);
                    res.send(err);
                }
                if(Rank !== undefined) {
                    Permissions.findOne({RankId: Rank._id}, function (err, permissions) {
                        if (err)
                        {
                            console.log("Error at : " + err);
                            res.send(err);
                        }
                        res.json(permissions);
                    });
                } else {
                    res.json({messages: "1"});
                }
            });
        } else {
            res.json({messages: "2"});
        }
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