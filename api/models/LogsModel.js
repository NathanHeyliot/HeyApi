'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let LogsSchema = new Schema
({
    User:
        {
            type: String, default: null, required: true
        },
    Url:
        {
            type: String, default: null, required: true
        },
    Method:
        {
            type: String, default: null, required: true
        },
    Date:
        {
            type: Date, default: Date.now()
        },
});

module.exports =  mongoose.model('Logs', LogsSchema);