'use strict'

let mongoose = require('mongoose'),
    Device = mongoose.model('Device'),
    Payload = mongoose.model('Payload'),

    globals = require('../../globals');

exports.list_device = function (req, res)
{
    Device.find({}, function (err, device)
    {
        if (err)
        {
            console.log("Error at : " + err);
            res.send(err);
        }
        console.log(device);
        res.render( globals.path + '/Devices.ejs', {dev: device});
    });
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


exports.create_device = function (req, res)
{
    let ActualTime = new Date();
    let dd = ActualTime.getDate();
    let mm = ActualTime.getMonth()+1;
    let yyyy = ActualTime.getFullYear();
    let hh = ActualTime.getHours();
    let min = ActualTime.getMinutes();
    let newDevice = new Device();

    newDevice.Created = dd + "/" + mm + "/" + yyyy + " " + hh + ":" + min;
    newDevice.LastUpdate = dd + "/" + mm + "/" + yyyy + " " + hh + ":" + min;
    newDevice.Name = req.body.Name;
    newDevice.GroupId = req.body.GroupId;
    newDevice.SigfoxId = req.body.SigfoxId;
    newDevice.DeviceType = req.body.DeviceType;

    //on initialise un nouveau capteur avec un remplissage a 0% et une calibration pour faciliter la mesure de calibration ensuite

    newDevice.FillLevel = 0;
    newDevice.CalibrationMeasure = -30;
    newDevice.save(function (err, device)
    {
        if(err)
            res.send(err);
        res.json(Device);
    });
};



exports.read_device = function (req, res)
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


exports.delete_device = function (req, res)
{
    Device.remove({_id: req.params.appId}, function (err, device)
    {
        if (err)
            res.send(err);
        res.json({message: "Device successfully  deleted"});
    });
};


exports.list_group_devices = function (req, res)
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

exports.list_bytype = function (req, res)
{
    Device.find({DeviceType: req.params.DeviceType}, function (err, device)
    {
        if (err)
            res.send(err);
        res.json(device);
    });
};