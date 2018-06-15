'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Position = require('../Class/PositionClass');


let DevicesSchema = new Schema
({
    Name:
       {
           type: String, unique: true, required: true
       },
    AccessId:
        {
          type: String, required: true, unique: true
        },
    GroupId:
        {
            type: String, required: true
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
            type: String, required : true
        },
});


module.exports = mongoose.model('Device', DevicesSchema);