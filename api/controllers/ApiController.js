'use strict';



let mongoose = require('mongoose'),
    Payload = mongoose.model('Payload'),
    Device = mongoose.model('Device');
/*
    https = require('https');
*/
let cal;


exports.list_payload = function (req, res) //GET all the payloads
{
    Payload.find({}, function (err, payload)
    {
        if (err)
        {
            Console.log("Error at : " + err);
            res.send(err);
        }
        res.json(payload);
        /*res.render('/affichage',  {
            variable: maValue
        })
        res.sendFile*/
    });
};


let checkEventCode = function(gotPayload)
{
   return(Number(gotPayload.Code.toString().substring(0,2)));
}

let fillParsed = function(gotPayload, EventCode) //Parse the payload and add it in a new payload
{

    console.log(EventCode);

    let ActualTime = new Date();
    let dd = ActualTime.getDate();
    let mm = ActualTime.getMonth()+1;
    let yyyy = ActualTime.getFullYear();
    let hh = ActualTime.getHours();
    let min = ActualTime.getMinutes();


    if (EventCode === 2)
    {
        let newPayload = new Payload();
        newPayload.PositionCode = String(gotPayload.Code.toString().substring(2,22));
    }


    else if(EventCode === 0)
    {
        let newPayload = new Payload;
        newPayload.EventCode = EventCode;
        newPayload.Mesure = Number(gotPayload.Code.toString().substr(2, 4));
        newPayload.DeviceId = gotPayload.DeviceId;
        newPayload.DateGot = dd + "/" + mm + "/" + yyyy + " " + hh + ":" + min;

        console.log("Calibration ... Valeur :\n" + newPayload);
        return(newPayload);
    }

    else if(EventCode === 1)
    {
        console.log("payload creation");
        let nbmes = Number(gotPayload.Code.toString().substr(2,2));
        let PayloadArray = new Array(nbmes);

        for(let i = 0; i !== nbmes; i++)
        {
            PayloadArray[i] = new Payload();
            PayloadArray[i].EventCode = EventCode;
            PayloadArray[i].Mesure = Number(gotPayload.Code.toString().substr(4 + (i * 4), 4));
            PayloadArray[i].DeviceId = gotPayload.DeviceId;
            PayloadArray[i].DateGot = dd + "/" + mm + "/" + yyyy + " " + hh + ":" + min;

        }
        return(PayloadArray);
    }
    else
        throw ("WARNING: Unknown Event Code ! ");
};

// let getPos = function (gotPayload)
// {
//    let jsonObject = JSON.stringify
//    ({
//        "type" : "ubiwifi",
//        "device" : gotPayload.DeviceId,
//        "data" : gotPayload.PositionCode
//    });
//
//    let postHeaders = {
//        'Content-Type' : 'application/json',
//        'Content-Length' : Buffer.byteLength(jsonObject, 'utf8')
//    };
//
//    let postOption = {
//        host : 'api.ubignss.com',
//        path : '/position',
//        method : 'POST',
//        headers : postHeaders
//    };
//     console.log("POST " + postOption);
//
//     let reqPost = https.request(postOption, function (res)
//     {
//      console.log("Status " + res.statusCode);
//      res.on('data', function(d)
//      {
//         console.log(d);
//
//      });
//     });
//     let tmp = reqPost;
//     reqPost.on('error', function (e)
//     {
//         console.error(e);
//     });
//     return(tmp);
// };

let fill_device = function(newPayload)
{
    let newDevice = new Device;
    if (newPayload.EventCode === 0)
    {
        newDevice.FillLevel = 0;
        newDevice.CalibrationMeasure = newPayload.Mesure;
    }
 /*   else if (newPayload == 2)
    {
        newDevice = getpos();
    }*/
    newDevice.LastUpdate = newPayload.DateGot;
    newDevice.AccessId = newPayload.DeviceId;

    return(newDevice);
};

exports.create_payload = function (req, res) //create a new payload and POST it
{
    let event;
   // let newPayload = fillParsed(req.body);

    //console.log("Payload is :\n" + newPayload);

    if ((event = checkEventCode(req.body)) === 1)
    {
        let newPayload = fillParsed((req.body), 1);
        let newDevice = fill_device(newPayload[newPayload.length - 1]);
        for (let i = 0; i !== newPayload.length; i++) {

            newPayload[i].save(function (err, payload) {
                if (err)
                    return (res.send(err));
                res.write(JSON.stringify(payload));

                if (i === newPayload.length - 1)
                {
                    Device.find({AccessId: newDevice.AccessId}, function (err, obj) {
                        cal = (obj[0].toObject().CalibrationMeasure);
                        console.log("cal is : " + cal);
                           newDevice.FillLevel =  100 - (newPayload[i].Mesure * 100 / cal);

                           if(newDevice.FillLevel >= 75)
                               newDevice.FillIndicator = 'PLEIN';
                            else if (newDevice.FillLevel <= 25)
                                newDevice.FillIndicator = 'VIDE';
                            else
                                newDevice.FillIndicator = 'NEUTRE';
                            Device.findOneAndUpdate({AccessId: newDevice.AccessId},
                                {FillLevel:newDevice.FillLevel, FillIndicator: newDevice.FillIndicator, LastUpdate: newDevice.LastUpdate},
                                {new: true}, function (err, device)
                                {
                                    if (err)
                                    {
                                        console.log("Error updating Device");
                                        return (res.send(err));
                                    }
                                    res.write(JSON.stringify(device));
                                    return (res.end());
                                });
                    });
                }
            });
        }
    }

    else if((event = checkEventCode(req.body)) === 0)
    {
        let newPayload = fillParsed((req.body), 0);
        let newDevice = fill_device(newPayload);

        newPayload.save(function(err, payload)
        {
            if (err)
                return(res.send(err));
            res.write(JSON.stringify(payload));
            Device.findOneAndUpdate({AccessId: newDevice.AccessId},{FillLevel: 0, CalibrationMeasure: newPayload.Mesure, LastUpdate: newDevice.LastUpdate },
                {new: true}, function (err, device)
                {
                if (err)
                    return(res.send(err));
                res.write(JSON.stringify(device));
                return(res.end());
            });
        });
    }
};



exports.get_paybydevice = function(req, res) //GET the payloads from sensor's name
{
    Payload.find({DeviceId: req.params.DeviceId}, function (err, payload)
    {
        console.log("Looking for payloads associated to the device " + req.params.DeviceId);
        if (err)
        {
            Console.log("Error at : " + err);
            res.send(err);
        }
        res.json(payload);
    });
};

exports.read_payload = function (req, res) //GET payloads from ID
{
    Payload.findById(req.params.appId, function (err, payload)
    {
        if (err)
            res.send(err);
        res.json(payload);
    });

};


exports.update_payload = function (req, res) //PUT Edit the specified payload
{
    Payload.findOneAndUpdate({_id: req.params.appId}, (req.body), {new: true}, function (err, payload)
    {
        if (err)
            res.send(err);
        res.json(payload);
    });

};


exports.delete_payload = function (req, res) //DELETE the specified payload
{
        Payload.remove({_id: req.params.appId}, function (err, payload)
        {
            if (err)
                res.send(err);
            res.json({message: "Payload successfully  deleted"});
        });

};