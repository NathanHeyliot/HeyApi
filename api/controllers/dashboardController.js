'use strict'


let mongoose = require('mongoose'),
    Device = mongoose.model('Device'),
    globals = require('../../globals');


exports.get_main = function(req, res)
{
    let nbEmpty = 0,
        nbFull = 0,
        nbNeutral = 0;

    Device.find({}, function (err, device)
    {
        if (err)
        {
            console.log("Error at : " + err);
            res.send(err);
        }

        for (let i = 0; i != device.length; i++)
        {
            if (device[i].FillLevel >= 75)
                nbFull++;
            else if(device[i].FillLevel <= 25)
                nbEmpty++;
            else
                nbNeutral++;
        }


        res.render( globals.path  + '/main.ejs', {dev: device, empty: nbEmpty, full: nbFull, neutral: nbNeutral});
    });
};