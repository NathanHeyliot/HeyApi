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
    City:
        {
            type: String
        },
    Address:
        {
            type: String
        },
    PostCode:
        {
            type: String
        },
    Phase_start:
        {
            type: int, required : true //Heure de début de phase
        },
    Phase_stop:
        {
            type: int, required : true //Heure de fin de phase
        },
    Wake_in:
        {
            type: int, required : true //Wake up in minute dans la phase
        },
    Wake_out:
        {
            type: int, required : true //Wake up in minute sortie de la phase
        },
    DeviceType:
        {
            type: String, required : true //dependante du type de device
        },
});


module.exports = mongoose.model('Device', DevicesSchema);