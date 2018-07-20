'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let OrganisationsSchema = new Schema
({
    Name:
        {
            type: String, unique: true
        },
});

module.exports = mongoose.model('Organisation', OrganisationsSchema);