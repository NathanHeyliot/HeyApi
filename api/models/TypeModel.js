'use strict';

let mongoose =  require('mongoose');
let Schema = mongoose.Schema;

let DeviceTypesSchema = new Schema
({
    Name:
        {
            type: String, required: true, unique: true
        },
    Unit:
        {
            type: String, required: true, default: 'mm'
        },
    ReferenceCalibration:
        {
            type: Number, default: null
        },
    Formula:
        {
            type: String, default: null
        },
});

module.export = mongoose.model('DeviceTypes', DeviceTypesSchema);

