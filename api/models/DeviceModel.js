'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let DevicesSchema = new Schema
({

    Name:
       {
           type: String, unique: true, required: true
       },
    SigfoxId:
        {
          type: String, required: true,
        },
    GroupId:
        {
            type: String, required: true //dependante d'un ID de groupe
        },
    CalibrationMeasure:
        {
            type: Number
        },
    FillLevel:
        {
            type: Number
        },
    Created:
        {
            type: String
        },
    LastUpdate:
        {
            type: String
        },
    Lon:
        {
            type: String
        },
    Lat:
        {
            type: String
        },
    DeviceType:
        {
            type: String, required : true //dependante du type de device
        },
});


module.exports = mongoose.model('Device', DevicesSchema);