'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let PayloadSchema = new Schema
({

    DeviceId:
        {
            type: String, required: true //dependante du device ID
        },
    EventCode:
        {
            type: String, required: true
        },
    Mesure:
        {
            type: String, default: null
        },
    Localisation:
        {
            type: String, default: null
        },
    DateGot:
        {
            type: String
        },
});


module.exports = mongoose.model('Payload', PayloadSchema);