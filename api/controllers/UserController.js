'use strict'
//include
let mongoose = require('mongoose'),
    User = mongoose.model('User'),
    globals = require('../../globals');

exports.list_users = function (req, res)
{
    User.find({}, function(err, user)
    {
        if(err)
        {
            error("Error at: " + err);
            res.send(err);
        }
        res.json(user);
    })
};

exports.user_info = function (req, res)
{
    User.find({_id: req.params.UserId}, function(err, user)
    {
        if(err)
        {
            error("Error at: " + err);
            res.send(err);
        }
        res.json(user);
    })
}

exports.update_user = function (req, res)
{
    User.findOneAndUpdate({_id: req.params.UserId}, (req.body), {new: true}, function (err, device)
    {
        if (err)
            res.send(err);
        res.json(device);
    });
};

exports.delete_all_users = function (req, res)
{
    console.log("Deleting all users ....");
    User.collection.remove({});
    res.end();
    console.log("Success");
}

exports.delete_user = function (req, res)
{
    User.remove({_id: req.params.UserId}, function (err, user)
    {
        if (err)
            res.send(err);
        res.json({message: "User successfully  deleted"});
    });
};

exports.create_user = function (req, res)
{
    let newUser = new User(req.body);

    newUser.save(function (err, user)
    {
        if(err)
            return(res.send(err));
        res.json(user);
    });
};