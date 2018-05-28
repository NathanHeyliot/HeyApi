'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let GroupsSchema = new Schema
({
    GroupId:
        {
            type : String, required: true
        },
    Name:
        {
            type: String,
        },
    ParentGroupId:
        {
            type: String,
        },
});

module.exports =  mongoose.model('Group', GroupsSchema);