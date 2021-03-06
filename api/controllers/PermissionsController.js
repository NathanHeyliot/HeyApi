'use strict';

let mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Ranks = mongoose.model('Ranks'),
    Auth = require('./AuthController'),
    Permission = require("./PermissionsController"),
    PermissionConfig = require("./PermissionConfig"),
    Permissions = mongoose.model('Permissions');


/*
* Comment utiliser la fonction has permission, elle return soit true ou false
*
* Promise all me permet de transmettre "req" dans le scope enfantin
*
* Promise.all([req, Permission.hasPermission("API_LOCALISATION_POSTUNCRYPTED", req)]).then(data => { console.log(data); });
 */

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

                                if(permissions[perm] !== true)
                                    resolve(false);
                                else
                                    resolve(true);
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

exports.middlewarePermissions = function (req, res, next) {

    let route_protect = PermissionConfig.route_config();
    let found = false;

    route_protect.forEach(data => {
        if(req.method.toUpperCase() === data.method.toUpperCase()) {
            if(data.type.toUpperCase() === "PARTIAL") {
                    if(req.url.startsWith(data.url, 0)) {
                        found = true;
                        if(data.permission.toLowerCase() === "none".toLowerCase() && (req.headers['x-access-token'] === null || req.headers['x-access-token'] === undefined)) {
                            req.hasPermissionBypass = false;
                            next();
                        } else {
                            Promise.all([
                                data,
                                Permission.hasPermission(data.permission, req),
                                Permission.hasPermission("API_BYPASS_" + data.method, req)
                            ]).then(response => {
                                if(response[1] === true || response[0].permission.toLowerCase() === "none".toLowerCase() || response[2] === true) {
                                    req.hasPermissionBypass = response[2];
                                    next();
                                } else {
                                    res.json({error: "No permission to do that !"});
                                }
                            });
                        }
                    }
            } else if (data.type.toUpperCase() === "FULL") {
                if(req.url === data.url || req.url === data.url + "/") {
                    found = true;
                    if(data.permission.toLowerCase() === "none".toLowerCase() && (req.headers['x-access-token'] === null || req.headers['x-access-token'] === undefined)) {
                        req.hasPermissionBypass = false;
                        next();
                    } else {
                        Promise.all([
                            data,
                            Permission.hasPermission(data.permission, req),
                            Permission.hasPermission("API_BYPASS_" + data.method, req)
                        ]).then(response => {
                            if(response[1] === true || response[0].permission.toLowerCase() === "none".toLowerCase() || response[2] === true) {
                                req.hasPermissionBypass = response[2];
                                next();
                            } else {
                                res.json({error: "No permission to do that !"});
                            }
                        });
                    }
                }
            } else {
                console.log("Route type undefined for : " + response[0]);
                res.end();
            }
        }
    });

    if(found === false)
        res.end();
};

exports.getPermissions = function (req, res)
{
            var user_entity = Auth.check_token(req);

            user_entity.then(user_entity => {
                if(user_entity.bypass === true) {
                    Permissions.find({}, function (err, permissions) {
                        if (err)
                        {
                            res.send(err);
                        }
                        res.json(permissions);
                    });
                } else {
                    User.findOne({_id: user_entity.user_id}, function (err, User)
                    {
                        if (err)
                        {
                            res.send(err);
                        }
                        if(User !== null && User !== undefined && mongoose.Types.ObjectId.isValid(User.RankId)) {
                            Ranks.findOne({_id: User.RankId}, function (err, Rank) {
                                if (err)
                                {
                                    res.send(err);
                                }

                                if(Rank !== null && Rank !== undefined) {
                                    Permissions.findOne({RankId: Rank._id}, function (err, permissions) {
                                        if (err)
                                        {
                                            res.send(err);
                                        }
                                        res.json(permissions);
                                    });
                                } else {
                                    res.end();
                                }
                            });
                        } else {
                            res.end();
                        }
                    });
                }
            });
};


exports.createPermissions = function (req, res) {
    let newPermissions = new Permissions(req.body);
    newPermissions.save(function (err, permissions)
    {
        if(err)
            return(res.send(err));
        res.json(permissions);
    });
};

exports.delete_allPermissions = function (req, res) {
    Permissions.collection.remove({});
    res.end();
    console.log("Success");

};

exports.getPermission = function (req, res) {

    if(mongoose.Types.ObjectId.isValid(req.params.id)) {
        Permissions.findOne({RankId: req.params.id}, function (err, perm) {
            if (err) {
                res.send(err);
            }
            res.json(perm);
        });
    } else {
        res.json({error: "Invalid mongoose ID !"});
    }
};

exports.removePermissions = function (req, res) {

    if(mongoose.Types.ObjectId.isValid(req.params.id)) {

        Permissions.remove({_id: req.params.id}, function(err, permissions)
        {
            if(err)
                res.send(err);
            res.json({message: "Permissions deleted succefully !"});
        });
    } else {
        res.json({error: "Invalid mongoose ID !"});
    }
};

exports.updatePermissions = function (req, res) {

    if(mongoose.Types.ObjectId.isValid(req.params.id)) {

        Permissions.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function (err, permissions)
        {
            if(err)
                res.send(err);
            res.json(permissions);
        });
    } else {
        res.json({error: "Invalid mongoose ID !"});
    }
};
