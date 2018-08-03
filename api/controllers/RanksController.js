'use strict';

let mongoose = require('mongoose'),
    Auth = require('./AuthController'),
    User = mongoose.model('User'),
    Ranks = mongoose.model('Ranks');

exports.getRanks = function (req, res) {
    var bypass = req.headers.Bypass;
    var user_entity = Auth.check_token(req);

    console.log(bypass);

    if(bypass === true) {
        console.log("Bypass");
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
        user_entity.then(user_entity => {
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
        });
    }
};

exports.createRanks = function (req, res) {
    console.log("Submitting a new Rank");

    let newRank = new Ranks(req.body);
    newRank.save(function (err, ranks)
    {
        if(err)
            return(res.send(err));
        res.json(ranks);
    });
};

exports.delete_allRanks = function (req, res) {
    console.log("Deleting all ranks....");
    Ranks.collection.remove({});
    res.end();
    console.log("Success");
};

exports.removeRanks = function (req, res) {
    console.log("Deleting of specified information, ID : " + req.params.id);

    Ranks.remove({_id: req.params.id}, function(err, ranks)
    {
        if(err)
            res.send(err);
        res.json({message: "Rank deleted succefully !"});
    });
};

exports.updateRanks = function (req, res) {
    console.log("Updating rank, ID : " + req.params.id);

    Ranks.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function (err, ranks)
    {
        if(err)
            res.send(err);
        res.json(ranks);
    });
};