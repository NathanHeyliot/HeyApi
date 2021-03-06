'use strict'
//include
let mongoose = require('mongoose'),
    Device = mongoose.model('Device'),
    Groups = mongoose.model('Group'),
    Payload = mongoose.model('Payload'),
    Types = mongoose.model('DeviceTypes'),
    UserGroup = mongoose.model('UserGroup');

// Standalone usage
var XMLHttpRequest = require('node-http-xhr');

// Usage as global XHR constructor
global.XMLHttpRequest = require('node-http-xhr');

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
    });
};

exports.update_device = function (req, res) //PUT Edit the specified payload
{
    if(mongoose.Types.ObjectId.isValid(req.params.appId)) {
        console.log(req.body);

        Device.findOneAndUpdate({_id: req.params.appId}, (req.body), {new: true}, function (err, device)
        {
            if (err)
                res.send(err);
            res.json(device);
        });
    } else {
        res.json({error: "Invalid mongoose ID !"});
    }
};


exports.delete_all_devices = function (req, res)
{
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


    newDevice.Created = new Date(yyyy + "/" + mm + "/" + dd + " " + hh + ":" + min);
    newDevice.LastUpdate = new Date(yyyy + "/" + mm + "/" + dd + " " + hh + ":" + min);
    newDevice.Name = req.body.Name;
    newDevice.SlackChanel = req.body.SlackChanel;
    newDevice.Description = req.body.Description;
    newDevice.GroupId = req.body.GroupId;
    newDevice.SigfoxId = req.body.SigfoxId;
    newDevice.DeviceType = req.body.DeviceType;
    newDevice.Phase_start = req.body.Phase_start;
    newDevice.Phase_stop = req.body.Phase_stop;
    newDevice.Wake_in = req.body.Wake_in;
    newDevice.Wake_out = req.body.Wake_out;
    newDevice.MesureNbr = req.body.MesureNbr;
    newDevice.Lon = req.body.Lon;
    newDevice.Lat = req.body.Lat;
    newDevice.Hide = req.body.Hide;
    newDevice.idLV = req.body.idLV;

    if(newDevice.Lat && newDevice.Lon) {

        req = new XMLHttpRequest();

        req.addEventListener('load', function() {
            let parsed_get = JSON.parse(req.response);

            console.log(parsed_get);

            let City = "";
            if(parsed_get.address.village && parsed_get.address.village !== "" && parsed_get.address.village !== undefined && parsed_get.address.village !== null)
                City = parsed_get.address.village;
            else if (parsed_get.address.town && parsed_get.address.town !== "" && parsed_get.address.town !== undefined && parsed_get.address.town !== null)
                City = parsed_get.address.town;
            else
                City = parsed_get.address.city;

            newDevice.PostCode =  parsed_get.address.postcode;
            newDevice.City = City;
            newDevice.Address = parsed_get.address.road;

            //on initialise un nouveau capteur avec un remplissage a 0% et une calibration a - 30 pour faciliter la mesure de calibration ensuite

            newDevice.FillLevel = 0;
            newDevice.CalibrationMeasure = -30;

            console.log(newDevice);

            //Ajoute le nouveau device a la BDD
            newDevice.save(function (err, device)
            {
                if(err) {
                    res.send(err);
                } else {
                    res.json(Device);
                }
            });

        });

        req.open("GET", "https://eu1.locationiq.org/v1/reverse.php?key=9126593a665608&lat=" + newDevice.Lat + "&lon=" + newDevice.Lon + "&format=json", true);
        req.send(null);
    } else {
        //on initialise un nouveau capteur avec un remplissage a 0% et une calibration a - 30 pour faciliter la mesure de calibration ensuite

        newDevice.FillLevel = 0;
        newDevice.CalibrationMeasure = -30;

        console.log(newDevice);

        //Ajoute le nouveau device a la BDD
        newDevice.save(function (err, device)
        {
            if(err) {
                res.send(err);
            } else {
                res.json(Device);
            }
        });
    }
};

exports.read_device = function(req, res) //recupere les details d'un capteur et renvoie sous forme de JSON
{
    if(mongoose.Types.ObjectId.isValid(req.params.appId)) {
        Device.find({_id: req.params.appId}, function (err, device)
        {
            if(err)
                res.send(err);

            Types.find({_id: device[0].DeviceType}, function (err, my_type) {
                if(err)
                    res.send(err);
                device.push(my_type[0]);
                res.json(device);
            });
        });
    } else {
        res.json({error: "Invalid mongoose ID !"});
    }
};

exports.delete_device = function (req, res) //supprime le device séléctionné
{
    if(mongoose.Types.ObjectId.isValid(req.params.appId)) {

        Device.remove({_id: req.params.appId}, function (err, device)
        {
            if (err)
                res.send(err);
            res.json({message: "Device successfully  deleted"});
        });
    } else {
        res.json({error: "Invalid mongoose ID !"});
    }
};


exports.list_group_devices = function (req, res) //Recupere tout les device d'un groupe séléctionné
{
    
    //Groups.find({$or: [{_id: req.params.GroupId}, {ParentId: req.params.GroupId}]}, function (err, groups) {
        
    //});
    let Hidden = req.body.Hidden;

   // if(Hidden) {
        Device.find({GroupId: req.params.GroupId}, function (err, device)
        {
            if (err)
            {
                console.log("Error at : " + err);
                res.send(err);
            }
            res.json(device);
        });
 /*   } else {
        Device.find({GroupId: req.params.GroupId, Hide: false}, function (err, device)
        {
            console.log("Looking for devices from group :" + req.params.GroupId);
            if (err)
            {
                console.log("Error at : " + err);
                res.send(err);
            }
            res.json(device);
        });
    }*/
};

exports.list_user_devices = function (req, res)
{
    UserGroup.find({user_id: req.params.UID}, function (err, group) {
        if(err) {
            res.send(err);
        }

        get_user_devices_anex(res, group);
    })
};


let get_user_devices_anex = async function(res, group)
{
    var devices_list = [];
    var group_do = 0;

    await group.forEach(function (element, index, array) {
        Device.find({GroupId: element.device_group_id}, {'Created': 0, 'LastUpdate': 0, 'SigfoxId': 0, 'DeviceType': 0, '__v': 0, 'CalibrationMeasure': 0}, function (err, device)
        {
            group_do++;
            if (err)
            {
                res.send(err);
            }
            devices_list.push(device);

            if(group_do === array.length) {
                res.json(devices_list);
            }
        });
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