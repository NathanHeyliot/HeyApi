'use strict'

//include
let mongoose = require('mongoose'),
    Organisation = mongoose.model('Organisation');

exports.list_organisation = function (req, res) //Liste tout les clients
{
    Organisation.find({}, function (err, organisation)
    {
        if (err)
        {
            console.log("Error at : " + err);
            res.send(err);
        }
        res.json(organisation);
    });
};

exports.crate_organisation = function (req, res)//crée un nouveau client
{
    let newOrganisation = new Organisation(req.body);
    newOrganisation.save(function (err, organisation)
    {
        if(err)
            return(res.send(err));
        res.json(organisation);
    });
};

exports.update_organisation = function (req, res) //met a jour les informations d'un client #CTristOnAPlusDeThunes
{
    Organisation.findOneAndUpdate({_id: req.params.taskID}, req.body, {new: true}, function (err, organisation)
    {
        if(err)
            res.send(err);
        res.json(organisation);
    });
};

exports.delete_organisation = function (req, res) //Supprime un client
{
    Organisation.remove({_id: req.params.appId}, function(err, organisation)
    {
            if(err)
                res.send(err);
            res.json({message: "L'organisation n'est plus notre amie !"});
    });
};
