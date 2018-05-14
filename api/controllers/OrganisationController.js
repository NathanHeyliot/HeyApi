'use strict'

let mongoose = require('mongoose'),
    Organisation = mongoose.model('Organisation');

exports.list_organisation = function (req, res)
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

exports.crate_organisation = function (req, res)
{
    let newOrganisation = new Organisation(req.body);
    newOrganisation.save(function (err, organisation)
    {
        if(err)
            return(res.send(err));
        res.json(organisation);
    });
};

exports.update_organisation = function (req, res)
{
    Organisation.findOneAndUpdate({_id: req.params.taskID}, req.body, {new: true}, function (err, organisation)
    {
        if(err)
            res.send(err);
        res.json(organisation);
    });
};

exports.delete_organisation = function (req, res)
{
    Organisation.remove({_id: req.params.appId}, function(err, organisation)
    {
            if(err)
                res.send(err);
            res.json({message: "L'organisation n'est plus notre amie !"});
    });
};
