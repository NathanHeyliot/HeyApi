'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let OrganisationsSchema = new Schema
({
    OrgId:
        {
            type: String, unique: true, required: true
        },
    Name:
        {
            type: String, unique: true
        },
});

module.exports = mongoose.model('Organisation', OrganisationsSchema);