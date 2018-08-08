'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let RanksSchema = new Schema
({
    Name:
        {
            type: String, required: true, unique: true
        },
});

module.exports =  mongoose.model('Ranks', RanksSchema);