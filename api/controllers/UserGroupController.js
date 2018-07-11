'use strict'

let mongoose = require('mongoose'),
    UserGroup = mongoose.model('UserGroup'),
    globals = require('../../globals');

exports.list_groups = function(req, res)
{
    console.log("List of users group");

    UserGroup.find({}, function (err, groups) {
        if(err)
        {
            error("Error at: " + err);
            res.send(err);
        }
        res.json(groups);
    });
}

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
    console.log("Getting info about user group");

    UserGroup.find({_id: req.params.Gid}, function (err, group) {
        if(err) {
            error("Error at: " + err);
            res.send(err);
        }
        res.json(group);
    })
}

exports.get_infoU = function (req, res)
{
    console.log("getting user info, USERID : " + req.params.Uid)

    UserGroup.find({user_id: req.params.Uid}, function (err, group) {
        if(err) {
            error("Error at: " + err);
            res.send(err);
        }
        res.json(group);
    })
}

exports.delete_group = function (req, res) {

    console.log("Deleting an user group");

    UserGroup.remove({_id: req.params.Gid}, function (err, group)
    {
        if (err)
            res.send(err);
        res.json({message: "User successfully  deleted"});
    });
}

exports.update_group = function (req, res) {

    console.log("Updating an user group");

    UserGroup.findOneAndUpdate({_id: req.params.Gid}, req.body, {new: true}, function (err, group)
    {
        if(err)
            res.send(err);
        res.json(group);
    });
}

exports.delete_all_usergroups = function (req, res)
{
    console.log("Deleting all User groups ....");
    UserGroup.collection.remove({});
    res.end();
    console.log("Success");
}