'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let SalesSchema = new Schema
({
    idLV:
        {
            type: String, unique: true, required: true
        },
    Date:
        {
            type: Date, default: Date.now(), required: true
        },
    ProductLabel:
        {
            type: String, required: true
        },
    Provided:
        {
            type: Number, required: true
        },
    Unsold:
        {
            type: Number, required: true
        },
});

module.exports =  mongoose.model('Sales', SalesSchema);