'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let OrganisationsSchema = new Schema
({
    Name:
        {
            type: String, required: true
        },
});

module.exports = mongoose.model('Organisation', OrganisationsSchema);