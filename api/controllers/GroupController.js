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

exports.delete_all_groups = function (req, res)
{
    console.log("Deleting all groups....");
    Group.collection.remove({});
    res.end();
    console.log("Success");
}

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
    if(mongoose.Types.ObjectId.isValid(req.params.id)) {
        Group.findOneAndUpdate({_id: req.params.appId}, req.body, {new: true}, function (err, group)
        {
            if(err)
                res.send(err);
            res.json(group);
        });
    } else {
        res.json({error: "Invalid mongoose ID !"});
    }

};

exports.read_group = function(req, res)//renvoie les information d'un groupe
{
    if(mongoose.Types.ObjectId.isValid(req.params.appId)) {
        Group.find({_id: req.params.appId}, function (err, group)
        {
            if (err)
                res.send(err);
            res.json(group);
        })
    } else {
        res.json({error: "Invalid mongoose ID !"});
    }
};

exports.delete_group = function(req, res) //supprime le groupe
{
    if(mongoose.Types.ObjectId.isValid(req.params.appId)) {
        Group.remove({_id: req.params.appId}, function(err, group)
        {
            if(err)
                res.send(err);
            res.json({message: "Group succesfully deleted"});
        });
    } else {
        res.json({error: "Invalid mongoose ID !"});
    }
};