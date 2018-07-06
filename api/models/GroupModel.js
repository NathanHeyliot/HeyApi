'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let GroupsSchema = new Schema
({
    GroupId:
        {
            type : String, unique: true, required: true
        },
    Name:
        {
            type: String, required: true
        },
    ParentGroupId:
        {
            type: String, //dependante du parent group id
        },

});

module.exports =  mongoose.model('Group', GroupsSchema);