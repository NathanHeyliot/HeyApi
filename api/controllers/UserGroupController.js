'use strict'

let mongoose = require('mongoose'),
    UserGroup = mongoose.model('UserGroup'),
    globals = require('../../globals');

exports.list_groups = function(req, res)
{
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
    UserGroup.find({_id: req.params.Gid}, function (err, group) {
        if(err) {
            error("Error at: " + err);
            res.send(err);
        }
        res.json(group);
    })
}

exports.delete_group = function (req, res) {
    UserGroup.remove({_id: req.params.Gid}, function (err, group)
    {
        if (err)
            res.send(err);
        res.json({message: "User successfully  deleted"});
    });
}

exports.delete_all_usergroups = function (req, res)
{
    console.log("Deleting all User groups ....");
    UserGroup.collection.remove({});
    res.end();
    console.log("Success");
}