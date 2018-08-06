'use strict';

let mongoose = require('mongoose'),
    UserGroup = mongoose.model('UserGroup'),
    Auth = require('./AuthController'),
    globals = require('../../globals');

exports.list_groups = function(req, res)
{
    console.log("List of users group");

    var user_entity = Auth.check_token(req);

    user_entity.then(user_entity => {
        if(user_entity.bypass === true) {
            UserGroup.find({}, function (err, groups) {
                if(err)
                {
                    error("Error at: " + err);
                    res.send(err);
                }
                res.json(groups);
            });
        } else {
            UserGroup.find({user_id: user_entity.user_id}, function (err, groups) {
                if(err)
                {
                    error("Error at: " + err);
                    res.send(err);
                }
                res.json(groups);
            });
        }
    });
};

exports.create_group = function (req, res)
{
    console.log("Creating a new user group");

    let newUserGroup = new UserGroup(req.body);

    newUserGroup.save(function (err, group)
    {
        if(err)
            return(res.send(err));
        res.json(group);
    });
}

exports.get_info = function (req, res)
{
    if(mongoose.Types.ObjectId.isValid(req.params.Gid)) {
        console.log("Getting info about user group");

        UserGroup.find({_id: req.params.Gid}, function (err, group) {
            if(err) {
                error("Error at: " + err);
                res.send(err);
            }
            res.json(group);
        })
    } else {
        res.json({error: "Invalid mongoose ID !"});
    }
};

exports.get_infoU = function (req, res)
{
    console.log("getting user info, USERID : " + req.params.Uid)

    UserGroup.find({user_id: req.params.Uid}, {'_id': 0, 'user_id': 0, '__v': 0}, function (err, group) {
        if(err) {
            error("Error at: " + err);
            res.send(err);
        }
        res.json(group);
    })
};

exports.delete_infoU = function (req, res)
{
    console.log("Delete user info, USERID : " + req.params.Uid);

    UserGroup.remove({user_id: req.params.Uid}, function (err, group) {
        if(err) {
            error("Error at: " + err);
            res.send(err);
        }
        res.json({message: "Link successfully deleted"});
    })
};

exports.delete_infoG = function (req, res)
{
    console.log("Delete user info, GroupID : " + req.params.Gid);

    UserGroup.remove({device_group_id: req.params.Gid}, function (err, group) {
        if(err) {
            error("Error at: " + err);
            res.send(err);
        }
        res.json({message: "Link successfully deleted"});
    })
};

exports.delete_group = function (req, res) {
    if(mongoose.Types.ObjectId.isValid(req.params.Gid)) {
        console.log("Deleting an user group");

        UserGroup.remove({_id: req.params.Gid}, function (err, group)
        {
            if (err)
                res.send(err);
            res.json({message: "User successfully  deleted"});
        });
    } else {
        res.json({error: "Invalid mongoose ID !"});
    }
};

exports.update_group = function (req, res) {

    if(mongoose.Types.ObjectId.isValid(req.params.Gid)) {
        console.log("Updating an user group");

        UserGroup.findOneAndUpdate({_id: req.params.Gid}, req.body, {new: true}, function (err, group)
        {
            if(err)
                res.send(err);
            res.json(group);
        });
    } else {
        res.json({error: "Invalid mongoose ID !"});
    }
};

exports.delete_all_usergroups = function (req, res)
{
    console.log("Deleting all User groups ....");
    UserGroup.collection.remove({});
    res.end();
    console.log("Success");
};