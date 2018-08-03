'use strict';

let mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Ranks = mongoose.model('Ranks'),
    Auth = require('./AuthController'),
    Permission = require('./PermissionsController'),
    Permissions = mongoose.model('Permissions');


exports.hasPermission = async function (perm, req)
{
    var user_entity = Auth.check_token(req);

    return new Promise((resolve, reject) => {
        user_entity.then(user_entity => {
            User.findOne({_id: user_entity.user_id}, function (err, User)
            {
                if (err)
                    resolve(false);
                if(User !== null && User !== undefined) {
                    Ranks.findOne({_id: User.RankId}, function (err, Rank) {
                        if (err)
                            resolve(false);
                        if(Rank !== null && Rank !== undefined) {
                            Permissions.findOne({RankId: Rank._id}, function (err, permissions) {
                                if (err)
                                    resolve(false);

                                console.log(permissions);

                                if(permissions.hasOwnProperty(perm)) {
                                    console.log("Found");
                                    resolve(true);
                                } else {
                                    console.log("Not Found");
                                    resolve(false);
                                }
                            });
                        } else {
                            resolve(false);
                        }
                    });
                } else {
                    resolve(false);
                }
            });
        });
    });
};

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
            if(User !== null && User !== undefined) {
                Ranks.findOne({_id: User.RankId}, function (err, Rank) {
                    if (err)
                    {
                        console.log("Error at : " + err);
                        res.send(err);
                    }

                    if(Rank !== null && Rank !== undefined) {
                        Permissions.findOne({RankId: Rank._id}, function (err, permissions) {
                            if (err)
                            {
                                console.log("Error at : " + err);
                                res.send(err);
                            }

                            Permission.hasPermission("API_PAYLOADS_GET", req).then(data => {
                               console.log(data);
                            });
                            res.json(permissions);
                        });
                    } else {
                        res.json({error: "Assigned Rank not found !"});
                    }
                });
            } else {
                res.json({error: "Assigned User not found !"});
            }
        });
    });
};

exports.createPermissions = function (req, res) {
    console.log("Submitting a new Permissions");

    let newPermissions = new Permissions(req.body);
    newPermissions.save(function (err, permissions)
    {
        if(err)
            return(res.send(err));
        res.json(permissions);
    });
};

exports.delete_allPermissions = function (req, res) {
    console.log("Deleting all permissions....");
    Permissions.collection.remove({});
    res.end();
    console.log("Success");
};

exports.removePermissions = function (req, res) {
    console.log("Deleting of specified information, ID : " + req.params.id);

    Permissions.remove({_id: req.params.id}, function(err, permissions)
    {
        if(err)
            res.send(err);
        res.json({message: "Permissions deleted succefully !"});
    });
};

exports.updatePermissions = function (req, res) {
    console.log("Updating permissions, ID : " + req.params.id);

    Permissions.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function (err, permissions)
    {
        if(err)
            res.send(err);
        res.json(permissions);
    });
};