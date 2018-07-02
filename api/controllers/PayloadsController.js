'use strict';

//includes
let mongoose = require('mongoose'),
    Payload = mongoose.model('Payload'),
    Device = mongoose.model('Device');

let cal;


exports.list_payload = function (req, res) //GET all the payloads
{
    console.log("Getting payloads list");

    Payload.find({}, function (err, payload)
    {
        if (err)
        {
            Console.log("Error at : " + err);
            res.send(err);
        }
        res.json(payload);

    });
};


let checkEventCode = function(gotPayload)
{
    if(typeof gotPayload.Code ==="string")
        return(Number(gotPayload.Code.substring(0,2)));
};

let fillParsed = function(gotPayload, EventCode) //Parse le payload et le stocke dans une var
{


    //on recupere la date de reception
    let ActualTime = new Date();
    let dd = ActualTime.getDate();
    let mm = ActualTime.getMonth()+1;
    let yyyy = ActualTime.getFullYear();
    let hh = ActualTime.getHours();
    let min = ActualTime.getMinutes();

    if (dd.toString().length === 1)
        dd = "0" + dd;
    if (mm.toString().length === 1)
        mm = "0" + mm;
    if (hh.toString().length === 1)
        hh = "0" + hh;
    if (min.toString().length === 1)
        min = "0" + min;


    if (EventCode === 2)
    {
        let newPayload = new Payload();
        newPayload.PositionCode = String(gotPayload.Code.toString().substring(2,22));
        //TODO envoyer les coordonnées GPS via Ubiscale et l'addresse via locationIq
    }

    //traite les payloads en fonction des Event Codes
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

//Crée un device temporaire pour mettre a jour la BDD
let fill_device = function(newPayload)
{
    let newDevice = new Device;
    if (newPayload.EventCode === 0) //some time undefined ???
    {
        newDevice.FillLevel = 0;
        newDevice.CalibrationMeasure = newPayload.Mesure;
    }
    newDevice.LastUpdate = newPayload.DateGot;
    newDevice.SigfoxId = newPayload.DeviceId;

    return(newDevice);
};


exports.create_payload = function (req, res) //create a new payload and POST it
{
    let event;

    console.log("Event Code : " + checkEventCode(req.body));

    //si event = 1 -> mesures on les stockes toutes une par une et on update le device associé
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
                    //calcul du pourcentage de remplissage
                    Device.find({SigfoxId: newDevice.SigfoxId}, function (err, obj) {
                        if(obj[0] !== undefined && obj[0] != null) { //check if device has been found in database
                            cal = (obj[0].toObject().CalibrationMeasure);
                            if (newPayload[i].Mesure !== 9999)// 9999 = error
                                newDevice.FillLevel =  100 - (newPayload[i].Mesure * 100 / cal);
                            else
                                newDevice.FillLevel = obj[0].toObject().FillLevel;
                            newDevice.FillLevel = newDevice.FillLevel.toFixed(2);
                            //On update le device
                            Device.findOneAndUpdate({SigfoxId: newDevice.SigfoxId},
                                {FillLevel:newDevice.FillLevel, LastUpdate: newDevice.LastUpdate},
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
                        } else {
                            console.log("Device not found");
                            return (res.end());
                        }
                    });
                }
            });
        }
    }
    //si event = 0 -> calibration On sauvegarde la mesure et on update le device
    else if((event = checkEventCode(req.body)) === 0)
    {
        let newPayload = fillParsed((req.body), 0);
        let newDevice = fill_device(newPayload);

        newPayload.save(function(err, payload)
        {
            if (err)
                return(res.send(err));
            res.write(JSON.stringify(payload));

            Device.findOneAndUpdate({SigfoxId: newDevice.SigfoxId},{FillLevel: 0, CalibrationMeasure: newPayload.Mesure, LastUpdate: newDevice.LastUpdate },
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



exports.get_paybydevice = function(req, res) //GET les payload associés au device
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

exports.read_payload = function (req, res) //GET payloads grace a leurs ID
{
    Payload.findById(req.params.appId, function (err, payload)
    {
        if (err)
            res.send(err);
        res.json(payload);
    });

};


exports.update_payload = function (req, res) //PUT Editer le payload spécifié
{
    Payload.findOneAndUpdate({_id: req.params.appId}, (req.body), {new: true}, function (err, payload)
    {
        if (err)
            res.send(err);
        res.json(payload);
    });

};


exports.delete_payload = function (req, res) //DELETE le payload specifié
{
        Payload.remove({_id: req.params.appId}, function (err, payload)
        {
            if (err)
                res.send(err);
            res.json({message: "Payload successfully  deleted"});
        });

};