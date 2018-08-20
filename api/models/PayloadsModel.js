'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const moment = require('moment-timezone');

let PayloadSchema = new Schema
({

    DeviceId:
        {
            type: String, required: true //dependante du device ID
        },
    EventCode:
        {
            type: Number, required: true
        },
    Mesure:
        {
            type: String, default: null
        },
    Localisation:
        {
            type: String, default: null
        },
    Latitude:
        {
            type: String, default: null
        },
    Longitude:
        {
            type: String, default: null
        },
    DateGot:
        {
            //type: Date
            type: String
        },
});

module.exports = mongoose.model('Payload', PayloadSchema);