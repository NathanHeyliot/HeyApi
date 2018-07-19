'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema
({
    FirstName:
        {
            type: String, required: true
        },
    LastName:
        {
            type: String, required: true
        },
    Email:
        {
            type: String, required: true, unique: true, lowercase: true
        },
    Password:
        {
            type: String, required: true
        },
    AdminLevel:
        {
            type: Number, default: 0
        },
    OrganisationID:
        {
          type: String, required: true // dependante of organisation !!!!
        },
    Created:
        {
            type: Date, default: Date.now
        },
    LastUpdated:
        {
            type: Date, default: Date.now
        },
});

module.exports = mongoose.model('User', UserSchema);