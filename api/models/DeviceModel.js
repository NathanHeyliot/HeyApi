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
    FillIndicator:
        {
            type: [{
                type: String,
                enum: ['PLEIN', 'NEUTRE', 'VIDE']
            }],
            required: true,
            default: ['NEUTRE']
        },
    Created:
        {
            type: String
        },
    LastUpdate:
        {
            type: String
        },
   /* DevicePosition:
        {
            type: Position
        },*/
    MeasureTimer:
        {
            type: String, required: true, default: "2001"
        },
    SendTimer:
        {
            type: String, required: true, default: "2004"
        },
    GeoTimer:
        {
            type: String, required: true, default: '  '
        },
    DeviceType:
        {
            type: String, required : true
        },
});


module.exports = mongoose.model('Device', DevicesSchema);