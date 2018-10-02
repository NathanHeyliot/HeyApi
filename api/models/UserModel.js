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
    Language:
        {
            type: String
        },
    Email:
        {
            type: String, required: true, unique: true, lowercase: true
        },
    Password:
        {
            type: String, required: true
        },
    RankId:
        {
            type: String, required: true
        },
    OrganisationID:
        {
            type: String, required: true // dependante of organisation !!!!
        },
    ApiToken:
        {
            type: String, default: null
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