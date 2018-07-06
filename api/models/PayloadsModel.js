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
            type: Number, required: true
        },
    Mesure:
        {
            type: Number, required: true
        },
    DateGot:
        {
            type: String
        },
});


module.exports = mongoose.model('Payload', PayloadSchema);