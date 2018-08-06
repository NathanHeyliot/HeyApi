'use strict';

let mongoose = require('mongoose'),
    Auth = require('./AuthController'),
    User = mongoose.model('User'),
    Permission = require("./PermissionsController"),
    Ranks = mongoose.model('Ranks');

exports.getRanks = function (req, res) {
    Promise.all([
        req,
        Permission.hasPermission("API_BYPASS_GET", req)
    ]).then(data => {
        if (data[1] === true) {
            var user_entity = Auth.check_token(data[0]);
            user_entity.then(user_entity => {
                if(user_entity.bypass === true && data[1] === true) {
                    Ranks.find({}, function (err, ranks) {
                        if (err)
                        {
                            console.log("Error at : " + err);
                            res.send(err);
                        }
                        console.log(ranks);
                        res.json(ranks);
                    });
                } else {
                    User.findOne({_id: user_entity.user_id}, function (err, User) {
                        if(User !== null && User !== undefined) {
                            Ranks.findOne({_id: User.RankId}, function (err, rank) {
                                if (err)
                                {
                                    console.log("Error at : " + err);
                                    res.send(err);
                                }
                                console.log(rank);
                                res.json(rank);
                            });
                        } else {
                            res.json({error: "User not found !"});
                        }
                    });
                }
            });
        } else {
            res.json({error: "You don't have permission to do that !"});
        }
    });
};

exports.createRanks = function (req, res) {
    Promise.all([
        req,
        Permission.hasPermission("API_RANKS_POST", req),
        Permission.hasPermission("API_BYPASS_POST", req)
    ]).then(data => {
        if (data[1] === true || data[2] === true) {
            console.log("Submitting a new Rank");

            let newRank = new Ranks(data[0].body);
            newRank.save(function (err, ranks)
            {
                if(err)
                    return(res.send(err));
                res.json(ranks);
            });
        } else {
            res.json({error: "You don't have permission to do that !"});
        }
    });
};

exports.delete_allRanks = function (req, res) {

    Promise.all([
        req,
        Permission.hasPermission("API_RANKS_DELALL", req),
        Permission.hasPermission("API_BYPASS_DEL", req)
    ]).then(data => {
        if(data[1] === true || data[2] === true) {
            console.log("Deleting all ranks....");
            Ranks.collection.remove({});
            res.end();
            console.log("Success");
        } else {
            res.json({error: "You don't have permission to do that !"});
        }
    });
};

exports.getRank = function (req, res) {
    Ranks.findOne({_id: req.params.id}, function (err, rank) {
        if(err) {
            console.log("Error at : " + err);
            res.send(err);
        }
        res.json(rank);
    });
};

exports.removeRanks = function (req, res) {

    Promise.all([
        req,
        Permission.hasPermission("API_RANKS_DEL", req),
        Permission.hasPermission("API_BYPASS_DEL", req)
    ]).then(data => {
        if(data[1] === true || data[2] === true) {
            console.log("Deleting of specified information, ID : " + data[0].params.id);

            Ranks.remove({_id: data[0].params.id}, function (err, ranks) {
                if (err)
                    res.send(err);
                res.json({message: "Rank deleted succefully !"});
            });
        } else {
            res.json({error: "You don't have permission to do that !"});
        }
    });
};

exports.updateRanks = function (req, res) {

    Promise.all([
        req,
        Permission.hasPermission("API_RANKS_PUT", req),
        Permission.hasPermission("API_BYPASS_PUT", req)
    ]).then(data => {
        if (data[1] === true || data[2] === true) {
            console.log("Updating rank, ID : " + req.params.id);

            Ranks.findOneAndUpdate({_id: data[0].params.id}, data[0].body, {new: true}, function (err, ranks)
            {
                if(err)
                    res.send(err);
                res.json(ranks);
            });
        } else {
            res.json({error: "You don't have permission to do that !"});
        }
    });
};