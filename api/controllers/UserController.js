'use strict';
//include
let mongoose = require('mongoose'),
    User = mongoose.model('User'),
    md5 = require('md5'),
    secret_encrypt = "Rmd8VY3OEFG2tX5Nr2uzdfyiqfdyizqlfdyizqfdyqziljota8FsPupTMXnGlY3jAkOeXEDQlmTY2p5QZUDFVL58vHOnNwAhPMRYwaCwaSCtsQIlEBZxEm4kT3hrj2A9faXr67cBEy2lcYRD1HdPVpzLiZJSoBR85XS9Jwv6vgVXBIE0uaw28AEs5QP15706jnJOSc1eImQo3eiKcle",
    expiration_time = "300d",
    jwt = require('jsonwebtoken'),
    Auth = require('../controllers/AuthController'),
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
    if(mongoose.Types.ObjectId.isValid(req.params.UserId)) {
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
    } else {
        res.json({error: "Invalid mongoose ID !"});
    }
};

exports.update_user = function (req, res)
{
    if(mongoose.Types.ObjectId.isValid(req.params.UserId)) {
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
    } else {
        res.json({error: "Invalid mongoose ID !"});
    }
};

exports.delete_all_users = function (req, res)
{
    console.log("Deleting all users ....");
    User.collection.remove({});
    res.end();
    console.log("Success");
};

exports.delete_user = function (req, res)
{
    if(mongoose.Types.ObjectId.isValid(req.params.UserId)) {
        console.log("Deleting an user : " + req.params.UserId);

        User.remove({_id: req.params.UserId}, function (err, user)
        {
            if (err)
                res.send(err);
            res.json({message: "User successfully  deleted"});
        });
    } else {
        res.json({error: "Invalid mongoose ID !"});
    }
};

exports.gen_token = function (req, res)
{
    let rand = function() {
        return Math.random().toString(36).substr(2); // remove `0.`
    };
    let token =  rand() + rand();

    Promise.all([Auth.check_token(req)]).then(response => {
        User.find({ApiToken: token}, function (err, succ) {
           if(succ !== null) {
               this.gen_token(req, res);
               return null;
           } else {
               User.findOneAndUpdate({_id: response.user_id}, {$set: {ApiToken: token}}, {new: true}, function (err, success) {
                   if(err)
                       console.log(err);
                   else
                       console.log("user : " + success + ", Updated !");
                   res.json(success);
               });
           }
        });
    });
};

exports.create_user = function (req, res)
{
    console.log("Creating a new user");

    let token = jwt.sign({
        FirstName: req.body.FirstName, Email: req.body.Email, Password: md5(req.body.Password)
    }, secret_encrypt, { expiresIn: expiration_time});

   let newUser = new User();
   newUser.FirstName = req.body.FirstName;
   newUser.LastName = req.body.LastName;
   newUser.Email = req.body.Email;
   newUser.Password = md5(req.body.Password);
   newUser.OrganisationID = req.body.OrganisationID;
   newUser.RankId = req.body.RankId;
   newUser.ApiToken = token;

   newUser.save(function (err, user)
   {
       if(err)
           return(res.send(err));
       res.json(user);
   });
};