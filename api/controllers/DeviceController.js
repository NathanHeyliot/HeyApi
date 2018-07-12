'use strict'
//include
let mongoose = require('mongoose'),
    Device = mongoose.model('Device'),
    Payload = mongoose.model('Payload'),
    UserGroup = mongoose.model('UserGroup'),
    jwt_auth = require("../controllers/AuthController"),

    globals = require('../../globals');


exports.render_device = function (req, res) //GET recupere les infos des devices et les envoie vers la page web pour affichage
{
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
    console.log("List of devices");

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
    console.log("Ipdate a device");

    Device.findOneAndUpdate({_id: req.params.appId}, (req.body), {new: true}, function (err, device)
    {
        if (err)
            res.send(err);
        res.json(device);
    });

};


exports.delete_all_devices = function (req, res)
{
    console.log("Deleting all devices ....");
    Device.collection.remove({});
    res.end();
    console.log("Success");
}


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

    console.log("Submitting new device ...");
    console.log(newDevice);

    //Ajoute le nouveau device a la BDD
    newDevice.save(function (err, device)
    {
        if(err) {
            console.log("Device can not be created.");
            res.send(err);
        } else {
            console.log("Device succefully created.");
            res.json(Device);
        }
    });
};



exports.render_detail = function (req, res) //recupere les details d'un capteur et render la page avec les infos du capteur
{
    Device.find({_id: req.params.appId},  function (err, device)
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
    Device.find({_id: req.params.appId}, function (err, device)
    {
        if(err)
            res.send(err);
        res.json(device);
    })
};

exports.delete_device = function (req, res) //supprime le device séléctionné
{
    console.log("Deleting a device, ID : " + req.params.appId);

    Device.remove({_id: req.params.appId}, function (err, device)
    {
        if (err)
            res.send(err);
        res.json({message: "Device successfully  deleted"});
    });
};


exports.list_group_devices = function (req, res) //Recupere tout les device d'un groupe séléctionné
{
    console.log("List of groups of devices by id, GROUP ID : " + req.params.GroupId);

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

exports.list_user_devices = function (req, res)
{
    console.log("List of devices for users : " + req.params.UID);

    let devices_list = [];

    UserGroup.find({user_id: req.params.UID}, function (err, group) {
        if(err) {
            error("Error at: " + err);
            res.send(err);
        }

        console.log("Groups found : " + group);

        group.forEach(function (element) {
            Device.find({GroupId: element.device_group_id}, function (err, device)
            {
                if (err)
                {
                    console.log("Error at : " + err);
                    res.send(err);
                }
                devices_list.push(device);
            });
        });
        res.json(devices_list);
    })
}

exports.list_bytype = function (req, res) //recupere tout les device du type spécifié
{
    console.log("List groups of device by types, TYPES : " + req.params.DeviceType);

    Device.find({DeviceType: req.params.DeviceType}, function (err, device)
    {
        if (err)
            res.send(err);
        res.json(device);
    });
};