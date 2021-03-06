'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let GroupsSchema = new Schema
({
    Name:
        {
            type: String, required: true
        },
    ParentId:
        {
            type: String, default: ""
        },
});

module.exports =  mongoose.model('Group', GroupsSchema);