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

exports.delete_all_organisations = function (req, res)
{
    Organisation.collection.remove({});
    res.end();
    console.log("Success");
};

exports.create_organisation = function (req, res)//crée un nouveau client
{
    let newOrganisation = new Organisation(req.body);
    newOrganisation.save(function (err, organisation)
    {
        if(err) {
            console.log(err);
            return(res.send(err));
        }
        res.json(organisation);
    });
};

exports.update_organisation = function (req, res) //met a jour les informations d'un client #CTristOnAPlusDeThunes
{
    if(mongoose.Types.ObjectId.isValid(req.params.appId)) {

        Organisation.findOneAndUpdate({_id: req.params.appId}, req.body, {new: true}, function (err, organisation)
        {
            if(err)
                res.send(err);
            res.json(organisation);
        });
    } else {
        res.json({error: "Invalid mongoose ID !"});
    }
};

exports.get_organisation = function (req, res) //get information about an organisation
{
    if(mongoose.Types.ObjectId.isValid(req.params.appId)) {

        Organisation.find({_id: req.params.appId}, function(err, organisation) {
           if(err)
               res.send(err);
           else
               res.json(organisation);
        });
    } else {
        res.json({error: "Invalid mongoose ID !"});
    }
}

exports.delete_organisation = function (req, res) //Supprime un client
{
    if(mongoose.Types.ObjectId.isValid(req.params.appId)) {
        Organisation.remove({_id: req.params.appId}, function(err, organisation)
        {
                if(err)
                    res.send(err);
                res.json({message: "Organisation deleted succefully !"});
        });
    } else {
        res.json({error: "Invalid mongoose ID !"});
    }
};
