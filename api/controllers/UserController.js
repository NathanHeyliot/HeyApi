'use strict'
//include
let mongoose = require('mongoose'),
    User = mongoose.model('User'),
    md5 = require('md5'),
    globals = require('../../globals');

exports.list_users = function (req, res)
{

    console.log("List of users...");

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
    console.log("user Info about : " + req.params.UserId)

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
    console.log("Updating a user : " + req.params.UserId)
    console.log(req.body);

    if(req.body.Password)
        req.body.Password = md5(req.body.Password);

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
    console.log("Deleting an user : " + req.params.UserId)

    User.remove({_id: req.params.UserId}, function (err, user)
    {
        if (err)
            res.send(err);
        res.json({message: "User successfully  deleted"});
    });
};

exports.create_user = function (req, res)
{
    console.log("Creating a new user");

   let newUser = new User();
   newUser.FirstName = req.body.FirstName;
   newUser.LastName = req.body.LastName;
   newUser.Email = req.body.Email;
   newUser.Password = md5(req.body.Password);
   newUser.OrganisationID = req.body.OrganisationID;
   newUser.AdminLevel = req.body.AdminLevel;

   newUser.save(function (err, user)
   {
       if(err)
           return(res.send(err));
       res.json(user);
   });
};