'use strict'

let mongoose = require('mongoose'),
    DeviceType = mongoose.model('DeviceTypes');

exports.list_devicetypes = function(req, res)
{
    console.log("List of devices types");

    DeviceType.find({}, function(err, devicetypes)
    {
        if (err)
            res.send(err);
        res.json(devicetypes);
    });
};

exports.create_devicetypes = function (req, res)
{
    console.log("Creating a device types");

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
    console.log("Deleting a specified device types, Name : " + req.params.Name);

    DeviceType.remove({Name: req.params.Name}, function (err, devicetypes)
    {
        if(err)
            res.send(err);
        res.json({message: "Device Type succefully deleted !"});
    });
};

exports.update_devicestypes = function (req, res)
{

    console.log("Updating device types, Name : " + req.params.Name);

    DeviceType.findOneAndUpdate({Name: req.params.Name}, req.body, {new: true}, function (err, devicestypes)
    {
        if(err)
            res.send(err);
        res.json(devicestypes);
    });
};

exports.information_devicestypes = function (req, res)
{
    console.log("Retrieve information of device types, Name : " + req.params.Name);

    DeviceType.find({Name: req.params.Name}, function (err, devicestypes) {
        if(err)
            res.send(err);
        else
            res.json(devicestypes);
    });
}

exports.delete_devicestypesid = function (req, res)
{
    console.log("Delete a specified device, ID : " + req.params.id);

    DeviceType.remove({_id: req.params.id}, function (err, devicetypes)
    {
        if(err)
            res.send(err);
        res.json({message: "Device Type succefully deleted !"});
    });
};

exports.update_devicestypesid = function (req, res)
{

    console.log("Update device types id : " + req.params.id)

    DeviceType.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function (err, devicestypes)
    {
        if(err)
            res.send(err);
        res.json(devicestypes);
    });
};

exports.information_devicestypesid = function (req, res)
{
    console.log("Retrieve information for device types, ID : " + req.params.id);

    DeviceType.find({_id: req.params.id}, function (err, devicestypes) {
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
    console.log("Success");
}