'use strict'

let mongoose =  require('mongoose'),
    Group = mongoose.model('Group');

exports.list_group = function (req, res) //get tout les devices
{
    Group.find({}, function (err, group)
    {
        if (err)
        {
            console.log("Error at : " + err);
            res.send(err);
        }
        res.json(group);
    });
};

exports.create_group = function (req, res)//crée un nouveau groupe
{
    let newGroup = new Group(req.body);
    newGroup.save(function (err, group)
    {
        if(err)
            return(res.send(err));
        res.json(group);
    });
};

exports.update_group = function (req, res) //modifie les informations d'un groupe
{
    Group.findOneAndUpdate({_id: req.params.appId}, req.body, {new: true}, function (err, group)
    {
        if(err)
            res.send(err);
        res.json(group);
    });
};

exports.read_group = function(req, res)//renvoie les information d'un groupe
{
    //Group.findById(req.params.appId, function(err, group)
    Group.find({GroupId: req.params.appId}, function (err, group)
    {
        if (err)
            res.send(err);
        res.json(group);
    })
};

exports.delete_group = function(req, res) //supprime le groupe
{
    Group.remove({_id: req.params.appId}, function(err, group)
    {
        if(err)
            res.send(err);
        res.json({message: "Group succesfully deleted"});
    });
};