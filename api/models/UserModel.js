'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema
({
    UserName:
        {
            type: String, required: true, unique: true,
        },
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
    Confirmed:
        {
            type: Boolean, default: false
        },
    Token:
        {
            type: String, Default: "NoTkn"
        },
    IsModo:
        {
            type: Boolean, default: false
        },
    OrganisationID:
        {
          type: String, required: true
        },
    GroupId:
        {
            type: String, required: true
        },
    Created:
        {
            type: Date, default: Date.now
        },
});

module.exports = mongoose.model('User', UserSchema);


//TODO: ajouter requetes avec la connection
//TODO ajouter les variables necessaires