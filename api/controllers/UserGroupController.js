'use strict';

let mongoose = require('mongoose'),
    UserGroup = mongoose.model('UserGroup'),
    Auth = require('./AuthController'),
    globals = require('../../globals');

exports.list_groups = function(req, res)
{
    var user_entity = Auth.check_token(req);

    user_entity.then(user_entity => {
        if(user_entity.bypass === true) {
            UserGroup.find({}, function (err, groups) {
                if(err)
                {
                    res.send(err);
                }
                res.json(groups);
            });
        } else {
            UserGroup.find({user_id: user_entity.user_id}, function (err, groups) {
                if(err)
                {
                    res.send(err);
                }
                res.json(groups);
            });
        }
    });
};

exports.create_group = function (req, res)
{
    let newUserGroup = new UserGroup(req.body);

    newUserGroup.save(function (err, group)
    {
        if(err)
            return(res.send(err));
        res.json(group);
    });
};

exports.get_info = function (req, res)
{
    if(mongoose.Types.ObjectId.isValid(req.params.Gid)) {
        UserGroup.find({_id: req.params.Gid}, function (err, group) {
            if(err) {
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
    UserGroup.find({user_id: req.params.Uid}, {'_id': 0, 'user_id': 0, '__v': 0}, function (err, group) {
        if(err) {
            res.send(err);
        }
        res.json(group);
    })
};

exports.delete_infoU = function (req, res)
{
    UserGroup.remove({user_id: req.params.Uid}, function (err, group) {
        if(err) {
            res.send(err);
        }
        res.json({message: "Link successfully deleted"});
    })
};

exports.delete_infoG = function (req, res)
{
    UserGroup.remove({device_group_id: req.params.Gid}, function (err, group) {
        if(err) {
            res.send(err);
        }
        res.json({message: "Link successfully deleted"});
    })
};

exports.delete_group = function (req, res) {
    if(mongoose.Types.ObjectId.isValid(req.params.Gid)) {
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
    UserGroup.collection.remove({});
    res.end();
};