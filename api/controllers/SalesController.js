'use strict';

let mongoose = require('mongoose'),
    SalesModel = mongoose.model('Sales');

exports.post_sales = function (req, res) {
    let newSales = new SalesModel(req.body);

    newSales.save(function (err, sales) {
        if(err) {
            console.log(err);
            res.send(err);
        }
        res.json(sales);
    });
};

exports.get_sale = function (req, res) {
    if(mongoose.Types.ObjectId.isValid(req.params.myid)) {
        SalesModel.find({idLV: req.params.myid}, function (err, group)
        {
            if (err)
                res.send(err);
            res.json(group);
        })
    } else {
        res.json({error: "Invalid mongoose ID !"});
    }
};