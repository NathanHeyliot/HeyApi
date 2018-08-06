'use strict';

let mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Ranks = mongoose.model('Ranks'),
    Auth = require('./AuthController'),
    Permission = require("./PermissionsController"),
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

function route_protected()
{
    let route = [
        {
            url: "/permissions",
            method: "GET",
            permission: "API_BYPASS_GET",
            type: "FULL",
        }
    ];
    return route;
}

exports.middlewarePermissions = function (req, res, next) {

    let route_protect = route_protected();

    route_protect.forEach(data => {
        Promise.all([
            data,
            req,
            res,
            next,
            Permission.hasPermission(data.permission, req)
        ]).then(response => {
            if(response[1].method.toUpperCase() === response[0].method.toUpperCase() && response[4] === true) {
                if(response[0].type.toUpperCase() === "PARTIAL") {
                    if(response[1].url.startsWith(response[0].url, 0)) {
                        next();
                    }
                } else if (response[0].type.toUpperCase() === "FULL") {
                    if(response[1].url === response[0].url) {
                        next();
                    }
                } else {
                    console.log("Route type undefined for : " + response[0]);
                    response[2].end();
                }
            }
        });
    });
};

exports.getPermissions = function (req, res)
{

    Promise.all([
        req,
        Permission.hasPermission("API_BYPASS_GET", req)
    ]).then(data => {
            var user_entity = Auth.check_token(req);

            user_entity.then(user_entity => {
                if(user_entity.bypass === true && data[1] === true) {
                    Permissions.find({}, function (err, permissions) {
                        if (err)
                        {
                            console.log("Error at : " + err);
                            res.send(err);
                        }
                        res.json(permissions);
                    });
                } else {
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
                }
            });
    });
};

exports.createPermissions = function (req, res) {

    Promise.all([
        req,
        Permission.hasPermission("API_PERMISSIONS_POST", req),
        Permission.hasPermission("API_BYPASS_POST", req)
    ]).then(data => {
        if (data[1] === true || data[2] === true) {


            console.log("Submitting a new Permissions");

            let newPermissions = new Permissions(data[0].body);
            newPermissions.save(function (err, permissions)
            {
                if(err)
                    return(res.send(err));
                res.json(permissions);
            });

        }else {
            res.json({error: "You don't have permission to do that !"});
        }
    });
};

exports.delete_allPermissions = function (req, res) {

    Promise.all([
        req,
        Permission.hasPermission("API_PERMISSIONS_DELALL", req),
        Permission.hasPermission("API_BYPASS_DEL", req)
    ]).then(data => {
        if (data[1] === true || data[2] === true) {
            console.log("Deleting all permissions....");
            Permissions.collection.remove({});
            res.end();
            console.log("Success");
        }else {
            res.json({error: "You don't have permission to do that !"});
        }
    });
};

exports.getPermission = function (req, res) {
    Permissions.findOne({_id: req.params.id}, function (err, perm) {
        if(err) {
            console.log("Error at : " + err);
            res.send(err);
        }
        res.json(perm);
    });
};

exports.removePermissions = function (req, res) {

    Promise.all([
        req,
        Permission.hasPermission("API_PERMISSIONS_DEL", req),
        Permission.hasPermission("API_BYPASS_DEL", req)
    ]).then(data => {
        if (data[1] === true || data[2] === true) {
            console.log("Deleting of specified information, ID : " + data[0].params.id);

            Permissions.remove({_id: data[0].params.id}, function(err, permissions)
            {
                if(err)
                    res.send(err);
                res.json({message: "Permissions deleted succefully !"});
            });
        }else {
            res.json({error: "You don't have permission to do that !"});
        }
    });
};

exports.updatePermissions = function (req, res) {

    Promise.all([
        req,
        Permission.hasPermission("API_PERMISSIONS_PUT", req),
        Permission.hasPermission("API_BYPASS_PUT", req)
    ]).then(data => {
        if (data[1] === true || data[2] === true) {
            console.log("Updating permissions, ID : " + data[0].params.id);

            Permissions.findOneAndUpdate({_id: data[0].params.id}, data[0].body, {new: true}, function (err, permissions)
            {
                if(err)
                    res.send(err);
                res.json(permissions);
            });
        }else {
            res.json({error: "You don't have permission to do that !"});
        }
    });
};