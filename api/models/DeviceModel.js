'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let DevicesSchema = new Schema
({

    Name:
       {
           type: String, unique: true, required: true
       },
    SlackChanel:
        {
            type: String, default: null
        },
    SigfoxId:
        {
            type: String, required: true,
        },
    idLV:
        {
            type: String
        },
    Description:
        {
          type: String, default: "",
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
    MinMeasure:
        {
            type: Number, default: 9999
        },
    Created:
        {
            type: Date, default: Date.now
        },
    LastUpdate:
        {
            type: Date, default: Date.now
        },
    Lon:
        {
            type: String
        },
    Lat:
        {
            type: String
        },
    accuracy:
        {
            type: Number, default: 0
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
            type: Number, required : true //Heure de début de phase
        },
    Phase_stop:
        {
            type: Number, required : true //Heure de fin de phase
        },
    Wake_in:
        {
            type: Number, required : true //Wake up in minute dans la phase
        },
    Wake_out:
        {
            type: Number, required : true //Wake up in minute sortie de la phase
        },
    DeviceType:
        {
            type: String, required : true //dependante du type de device
        },
    MesureNbr:
        {
            type: Number, required : true, default: 1
        },
    Downlink:
        {
            type: Number, default: 1
        },
    Hide:
        {
            type: Boolean, default: false,
        },
});


module.exports = mongoose.model('Device', DevicesSchema);