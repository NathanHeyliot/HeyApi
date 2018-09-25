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

    let start = req.params.start;
    let end = req.params.end;
    let id = req.params.myid;

        SalesModel.find({idLV: id, Date:{$gte: start, $lte: end}}, function (err, group)
        {
            if (err)
                res.send(err);
            res.json(group);
        }).sort({Date: -1});
};