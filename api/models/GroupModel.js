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
    Type:
        {
          type: Number, default: 0 // 0 == presentoire, 1 == poubelle
        },
});

module.exports =  mongoose.model('Group', GroupsSchema);