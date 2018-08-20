'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const moment = require('moment-timezone');
//const dateFrance = moment.tz(Date.now(), "Europe/Paris").add('2', 'hours');

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
            type: Date, default: moment().tz('Europe/Paris').add('4', 'hours')
        },
});

module.exports = mongoose.model('Payload', PayloadSchema);