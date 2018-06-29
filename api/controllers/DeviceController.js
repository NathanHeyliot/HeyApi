'use strict'
//include
let mongoose = require('mongoose'),
    Device = mongoose.model('Device'),
    Payload = mongoose.model('Payload'),

    globals = require('../../globals');


exports.render_device = function (req, res) //GET recupere les infos des devices et les envoie vers la page web pour affichage
{
    Device.dropIndex(AccessId);
    Device.find({}, function (err, device)
    {
        if (err)
        {
            console.log("Error at : " + err);
            res.send(err);
        }
        res.render( globals.path + '/Devices.ejs', {dev: device});
    });
};

exports.list_device = function(req, res) // GET recupere les infos des devices et les retournes en format JSON
{
    Device.find({}, function(err, device)
    {
        if(err)
        {
            error("Error at: " + err);
            res.send(err);
        }
        res.json(device);
    })
};

exports.update_device = function (req, res) //PUT Edit the specified payload
{
    Device.findOneAndUpdate({_id: req.params.appId}, (req.body), {new: true}, function (err, device)
    {
        if (err)
            res.send(err);
        res.json(device);
    });

};

//POST crée un nouveau device
exports.create_device = function (req, res)
{
    //on recupere la date
    let ActualTime = new Date();
    let dd = ActualTime.getDate();
    let mm = ActualTime.getMonth()+1;
    let yyyy = ActualTime.getFullYear();
    let hh = ActualTime.getHours();
    let min = ActualTime.getMinutes();
    let newDevice = new Device();

    //on rajoute des 0 pour les nombres a un chiffre
    if (dd.toString().length === 1)
        dd = "0" + dd;
    if (mm.toString().length === 1)
        mm = "0" + mm;
    if (hh.toString().length === 1)
        hh = "0" + hh;
    if (min.toString().length === 1)
        min = "0" + min;



    newDevice.Created = dd + "/" + mm + "/" + yyyy + " " + hh + ":" + min;
    newDevice.LastUpdate = dd + "/" + mm + "/" + yyyy + " " + hh + ":" + min;
    newDevice.Name = req.body.Name;
    newDevice.GroupId = req.body.GroupId;
    newDevice.SigfoxId = req.body.SigfoxId;
    newDevice.DeviceType = req.body.DeviceType;

    //on initialise un nouveau capteur avec un remplissage a 0% et une calibration a - 30 pour faciliter la mesure de calibration ensuite

    newDevice.FillLevel = 0;
    newDevice.CalibrationMeasure = -30;

    //Ajoute le nouveau device a la BDD
    newDevice.save(function (err, device)
    {
        if(err)
            res.send(err);
        res.json(Device);
    });
};



exports.render_detail = function (req, res) //recupere les details d'un capteur et render la page avec les infos du capteur
{
    Device.findById(req.params.appId,  function (err, device)
    {
        if (err)
            res.send(err);
        Payload.find({DeviceId: device.SigfoxId}, function (err, payloads) {
            res.render( globals.path + '/Detail.ejs', {dev: device, pay: payloads});
         });
    });
};

exports.read_device = function(req, res) //recupere les details d'un capteur et renvoie sous forme de JSON
{
    Device.findbyId(req.params.appId, function (err, device)
    {
        if(err)
            res.send(err);
        res.json(device);
    })
};

exports.delete_device = function (req, res) //supprime le device séléctionné
{
    Device.remove({_id: req.params.appId}, function (err, device)
    {
        if (err)
            res.send(err);
        res.json({message: "Device successfully  deleted"});
    });
};


exports.list_group_devices = function (req, res) //Recupere tout les device d'un groupe séléctionné
{
    Device.find({GroupId: req.params.GroupId}, function (err, device)
    {
        console.log("Looking for devices from group :" + req.params.GroupId);
        if (err)
        {
            console.log("Error at : " + err);
            res.send(err);
        }
        res.json(device);
    });
};

exports.list_bytype = function (req, res) //recupere tout les device du type spécifié
{
    Device.find({DeviceType: req.params.DeviceType}, function (err, device)
    {
        if (err)
            res.send(err);
        res.json(device);
    });
};