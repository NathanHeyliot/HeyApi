'use strict'

let mongoose = require('mongoose'),
    DeviceType = mongoose.model('DeviceTypes');

exports.list_devicetypes = function(req, res)
{
    DeviceType.find({}, function(err, devicetypes)
    {
        if (err)
            res.send(err);
        res.json(devicetypes);
    });
};

exports.create_devicetypes = function (req, res)
{
    let newDevicesTypes = new DeviceType(req.body);
    newDevicesTypes.save(function (err, devicetypes)
    {
        if (err)
            return(res.send(err));
        res.json(devicetypes);
    });
};

exports.delete_devicestypes = function (req, res)
{
    DeviceType.remove({Name: req.params.Name}, function (err, devicetypes)
    {
        if(err)
            res.send(err);
        res.json({message: "Device Type succefully deleted !"});
    });
};

exports.information_devicestypes = function (req, res)
{
    DeviceType.find({Name: req.params.Name}, function (err, devicestypes) {
        if(err)
            res.send(err);
        else
            res.json(devicestypes);
    });
}

exports.delete_all_devicestypes = function (req, res)
{
    console.log("Deleting all devices types ...");
    DeviceType.collection.remove({});
    res.end();
}