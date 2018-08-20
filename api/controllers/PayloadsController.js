'use strict';

//includes
let mongoose = require('mongoose'),
    Payload = mongoose.model('Payload'),
    Auth = require('./AuthController'),
    Local = require('./LocalisationController'),
    Device = mongoose.model('Device');

// Standalone usage
var XMLHttpRequest = require('node-http-xhr');

// Usage as global XHR constructor
global.XMLHttpRequest = require('node-http-xhr');

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

//Crée un device temporaire pour mettre a jour la BDD
let fill_device = function(newPayload, EventCode)
{
    let newDevice = new Device;
    if (EventCode === 0) //some time undefined ???
    {
        newDevice.FillLevel = 0;
        newDevice.CalibrationMeasure = newPayload.Mesure;
    }
    newDevice.LastUpdate = newPayload.DateGot;
    newDevice.SigfoxId = newPayload.DeviceId;

    return(newDevice);
};


exports.delete_all_payloads = function (req, res)
{
    console.log("Deleting all payloads ...");
    Payload.collection.remove({});
    res.end();
    console.log("Success");
};




exports.test_payloads = function (req, res) //create a new payload and POST it
{
    let event;

    console.log("Event Code : " + checkEventCode(req.body));
    console.log("Incomming HOST : " + req.ip);

    console.log("Payloads informations....");
    console.log(req.body);

    //si event = 1 -> mesures on les stockes toutes une par une et on update le device associé
    if ((event = checkEventCode(req.body)) === 1)
    {
        console.log("payload creation");
        let nbmes = Number(req.body.Code.toString().substr(2,2));
        let PayloadArray = new Array(nbmes);
        let MyDate = req.body.Date;

        Device.findOne({SigfoxId: req.body.DeviceId}, function (err, device)
        {
            if(device !== undefined && device !== null) {
                //Calcul de l'heure de la mesure

                var m_date = MyDate.split(" ");
                var sub_date = m_date[0].split("-");
                var hours = m_date[1].split(':');

                var now = new Date(sub_date[0], sub_date[1], sub_date[2], hours[0], hours[1], hours[2], 0);
                var heureActuelle = now.getHours();


                for(let i = 0; i !== nbmes; i++)
                {
                    PayloadArray[i] = new Payload();
                    PayloadArray[i].EventCode = event;
                    PayloadArray[i].Mesure = Number(req.body.Code.toString().substr(4 + (i * 4), 4));
                    PayloadArray[i].DeviceId = req.body.DeviceId;

                    if (heureActuelle >= parseInt(device.Phase_start) && heureActuelle < parseInt(device.Phase_stop))
                        var offset = (nbmes - (i+1)) * parseInt(device.Wake_in);
                    else
                        var offset = (nbmes - (i+1)) * parseInt(device.Wake_out);

                    var MS_PER_MINUTE = 60000;
                    var dateMeasure = new Date(now - (offset * MS_PER_MINUTE));

                    let dd = dateMeasure.getDate();
                    let mm = dateMeasure.getMonth();
                    let yyyy = dateMeasure.getFullYear();
                    let hh = dateMeasure.getHours();
                    let min = dateMeasure.getMinutes();

                    if (dd.toString().length === 1)
                        dd = "0" + dd;
                    if (mm.toString().length === 1)
                        mm = "0" + mm;
                    if (hh.toString().length === 1)
                        hh = "0" + hh;
                    if (min.toString().length === 1)
                        min = "0" + min;

                    PayloadArray[i].DateGot = yyyy + "-" + mm + "-" + dd + " " + hh + ":" + min;
                }

                console.log("Payload Array : " + PayloadArray);
                if(PayloadArray !== undefined) {
                    for (let i = 0; i !== PayloadArray.length; i++) {
                        PayloadArray[i].save(function (err, payload) {
                            console.log("Saving Payload...");
                        });
                    }
                    res.end();
                }
            }
        });
    }
    //si event = 0 -> calibration On sauvegarde la mesure et on update le device
    else if((event = checkEventCode(req.body)) === 0)
    {
        let Date = req.body.Date;

        let newPayload = new Payload;
        newPayload.EventCode = event;
        newPayload.Mesure = Number(req.body.Code.toString().substr(2, 4));
        newPayload.DeviceId = req.body.DeviceId;
        newPayload.DateGot = Date;

        console.log("Calibration ... Valeur :\n" + newPayload);
        let newDevice = fill_device(newPayload, 0);

        newPayload.save(function(err, payload)
        {
            if (err) {
                console.log(err);
                return(res.end());
            }

            Device.find({SigfoxId: newPayload.DeviceId}, function (err, obj) {
                if (obj[0] !== undefined && obj[0] != null) { //check if device has been found in database
                    Device.findOneAndUpdate({SigfoxId: newDevice.SigfoxId},{Downlink: 0, FillLevel: 0, CalibrationMeasure: newPayload.Mesure, LastUpdate: newDevice.LastUpdate },
                        {new: true}, function (err, device)
                        {
                            return(res.end());
                        });
                } else {
                    return(res.end());
                }
            });
        });
    }


    //Event 2 a test
    else if((event = checkEventCode(req.body)) === 2)
    {
        //ici faut s'occuper de l'event 2 qui permet la récupération d'une localisation avec une info crypté
        let PositionCode = String(req.body.Code.toString().substring(2,22));
        let DeviceId = req.body.DeviceId;
        let Date = req.body.Date;

        var req = new XMLHttpRequest();

        req.addEventListener('load', function() {
            var parsed_info = JSON.parse(req.response);
            if(parsed_info.code === "TECHNICAL") {
                console.log("Could not retrieve lat / long of the payload !");
                console.log(parsed_info);
                return(res.end());
            } else {
                req = new XMLHttpRequest();

                req.addEventListener('load', function() {
                    var parsed_get = JSON.parse(req.response);

                    Device.find({SigfoxId: DeviceId}, function (err, obj) {
                        if(obj[0] !== undefined && obj[0] != null) { //check if device has been found in database
                            let City = "";
                            if(parsed_get.address.village && parsed_get.address.village !== "" && parsed_get.address.village !== undefined && parsed_get.address.village !== null)
                                City = parsed_get.address.village;
                            else if (parsed_get.address.town && parsed_get.address.town !== "" && parsed_get.address.town !== undefined && parsed_get.address.town !== null)
                                City = parsed_get.address.town;
                            else
                                City = parsed_get.address.city;

                            Device.findOneAndUpdate({SigfoxId: DeviceId}, ({Downlink: 0, PostCode: parsed_get.address.postcode, LastUpdate: Date, Lon: parsed_info.lng, Lat: parsed_info.lat, City: City, Address: parsed_get.address.road}), {new: true}, function (err, device)
                            {
                                if (err)
                                    console.log(err);
                                let newPayload = new Payload;
                                newPayload.EventCode = event;
                                newPayload.Localisation = parsed_get.address.road + " - " + City;
                                newPayload.DeviceId = device.toObject().SigfoxId;
                                newPayload.DateGot = Date;
                                newPayload.save();

                                return(res.end());
                            });
                        } else {
                            return(res.end());
                        }
                    });
                });

                req.open("GET", "https://eu1.locationiq.org/v1/reverse.php?key=9126593a665608&lat=" + parsed_info.lat + "&lon=" + parsed_info.lng + "&format=json", true);
                req.send(null);
            }
        });

        req.open("POST", "https://api.ubignss.com/position", true);
        req.setRequestHeader("Content-Type", "application/json");
        req.setRequestHeader("Authorization", "Basic aGV5bGlvdF9ldmFsOlJ3ZGpkOnR5MUMyfg==");
        req.send(JSON.stringify({type: "ubiwifi", device: DeviceId, data: PositionCode}));
    }
};



































exports.create_payload = function (req, res) //create a new payload and POST it
{
    let event;

    console.log("Event Code : " + checkEventCode(req.body));
    console.log("Incomming HOST : " + req.ip);

    console.log("Payloads informations....");
    console.log(req.body);

    //si event = 1 -> mesures on les stockes toutes une par une et on update le device associé
    if ((event = checkEventCode(req.body)) === 1)
    {
        console.log("payload creation");
        let nbmes = Number(req.body.Code.toString().substr(2,2));
        let PayloadArray = new Array(nbmes);

        Device.findOne({SigfoxId: req.body.DeviceId}, function (err, device)
        {
            if(device !== undefined && device !== null) {
                //Calcul de l'heure de la mesure
                var now = new Date();
                var heureActuelle = now.getHours();

                for(let i = 0; i !== nbmes; i++)
                {
                    PayloadArray[i] = new Payload();
                    PayloadArray[i].EventCode = event;
                    PayloadArray[i].Mesure = Number(req.body.Code.toString().substr(4 + (i * 4), 4));
                    PayloadArray[i].DeviceId = req.body.DeviceId;

                    if (heureActuelle >= parseInt(device.Phase_start) && heureActuelle < parseInt(device.Phase_stop))
                        var offset = (nbmes - (i+1)) * parseInt(device.Wake_in);
                    else
                        var offset = (nbmes - (i+1)) * parseInt(device.Wake_out);

                    var MS_PER_MINUTE = 60000;
                    var dateMeasure = new Date(now - (offset * MS_PER_MINUTE));

                    let dd = dateMeasure.getDate();
                    let mm = dateMeasure.getMonth()+1;
                    let yyyy = dateMeasure.getFullYear();
                    let hh = dateMeasure.getHours();
                    let min = dateMeasure.getMinutes();

                    if (dd.toString().length === 1)
                        dd = "0" + dd;
                    if (mm.toString().length === 1)
                        mm = "0" + mm;
                    if (hh.toString().length === 1)
                        hh = "0" + hh;
                    if (min.toString().length === 1)
                        min = "0" + min;

                    PayloadArray[i].DateGot = yyyy + "-" + mm + "-" + dd + " " + hh + ":" + min;


                    if(PayloadArray[i].Mesure === 9999)
                        sendBOT(device.toObject().Name, req.body.DeviceId, device.toObject()._id, "Mesure",  "Erreur de mesure", PayloadArray[i].DateGot,  "#ea5153");
                    else
                        sendBOT(device.toObject().Name, req.body.DeviceId, device.toObject()._id, "Mesure",  PayloadArray[i].Mesure, PayloadArray[i].DateGot, "#45b384");
                }

                console.log("Payload Array : " + PayloadArray);
                if(PayloadArray !== undefined) {

                    let downsend = false;

                    for (let i = 0; i !== PayloadArray.length; i++) {

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


                        let newDevice = new Device;
                        newDevice.LastUpdate = yyyy + "-" + mm + "-" + dd + " " + hh + ":" + min;
                        newDevice.SigfoxId = PayloadArray[i].DeviceId;

                        PayloadArray[i].save(function (err, payload) {

                            console.log("Saving Payload...");

                            if (i === PayloadArray.length - 1)
                            {
                                //calcul du pourcentage de remplissage
                                Device.find({SigfoxId: newDevice.SigfoxId}, function (err, obj) {
                                    if(obj[0] !== undefined && obj[0] != null) { //check if device has been found in database
                                        cal = (obj[0].toObject().CalibrationMeasure);
                                        if (PayloadArray[i].Mesure !== 9999)// 9999 = error
                                            newDevice.FillLevel =  100 - (PayloadArray[i].Mesure * 100 / cal);
                                        else
                                            newDevice.FillLevel = obj[0].toObject().FillLevel;
                                        newDevice.FillLevel = newDevice.FillLevel.toFixed(2);
                                        let needDownlink = obj[0].toObject().Downlink;
                                        //On update le device
                                        Device.findOneAndUpdate({SigfoxId: newDevice.SigfoxId},
                                            {FillLevel:newDevice.FillLevel, LastUpdate: newDevice.LastUpdate, Downlink: 0},
                                            {new: true}, function (err, device)
                                            {
                                                console.log("Updating device ...");
                                                if (err)
                                                {
                                                    console.log("Error updating Device");
                                                    return(res.end());
                                                }

                                                if(needDownlink === 1 && downsend === false) {

                                                    //check if is good

                                                    let SigfoxId = device.toObject().SigfoxId;

                                                    //response in json ???? maybe bad ???
                                                    let resp_HD = device.toObject().Phase_start;
                                                    let resp_HF = device.toObject().Phase_stop;
                                                    let resp_PH1 = device.toObject().Wake_in;
                                                    let resp_PH2 = device.toObject().Wake_out;
                                                    let resp_N = device.toObject().MesureNbr;

                                                    if(resp_HD.toString().length === 1)
                                                        resp_HD = "0" + resp_HD;
                                                    if(resp_HF.toString().length === 1)
                                                        resp_HF = "0" + resp_HF;
                                                    if(resp_PH1.toString().length === 1)
                                                        resp_PH1 = "00" + resp_PH1;
                                                    else if(resp_PH1.toString().length === 2)
                                                        resp_PH1 = "0" + resp_PH1;
                                                    if(resp_PH2.toString().length === 1)
                                                        resp_PH2 = "00" + resp_PH2;
                                                    else if(resp_PH2.toString().length === 2)
                                                        resp_PH2 = "0" + resp_PH2;


                                                    let data = {
                                                        [SigfoxId] : {"downlinkData": hh + "" + min + "" + resp_HD + "" + resp_HF + "" + resp_PH1 + "" + resp_PH2 + "" + resp_N + "0"},
                                                    };

                                                    console.log("DATA : " + hh + min + resp_HD + resp_HF + resp_PH1 + resp_PH2 + resp_N + "0");
                                                    downsend = true;
                                                    res.json(data);
                                                }



                                                return(res.end());
                                            });
                                    } else {
                                        console.log("Device not found");
                                        return(res.end());
                                    }
                                });
                            }
                        });
                    }
                }
            }
        });
    }
    //si event = 0 -> calibration On sauvegarde la mesure et on update le device
    else if((event = checkEventCode(req.body)) === 0)
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

        let newPayload = new Payload;
        newPayload.EventCode = event;
        newPayload.Mesure = Number(req.body.Code.toString().substr(2, 4));
        newPayload.DeviceId = req.body.DeviceId;
        newPayload.DateGot = yyyy + "-" + mm + "-" + dd + " " + hh + ":" + min;

        console.log("Calibration ... Valeur :\n" + newPayload);
        let newDevice = fill_device(newPayload, 0);

        newPayload.save(function(err, payload)
        {
            if (err) {
                console.log(err);
                return(res.end());
            }

            Device.find({SigfoxId: newPayload.DeviceId}, function (err, obj) {
                if (obj[0] !== undefined && obj[0] != null) { //check if device has been found in database
                    let needDownlink = obj[0].toObject().Downlink;
                    Device.findOneAndUpdate({SigfoxId: newDevice.SigfoxId},{Downlink: 0, FillLevel: 0, CalibrationMeasure: newPayload.Mesure, LastUpdate: newDevice.LastUpdate },
                        {new: true}, function (err, device)
                        {

                            sendBOT(device.toObject().Name, device.toObject().SigfoxId, device.toObject()._id, "Calibration",  newPayload.Mesure,newPayload.DateGot,  "#007cb3");

                            if(needDownlink === 1) {
                                //check if is good

                                let SigfoxId = device.toObject().SigfoxId;

                                //response in json ???? maybe bad ???
                                let resp_HD = device.toObject().Phase_start;
                                let resp_HF = device.toObject().Phase_stop;
                                let resp_PH1 = device.toObject().Wake_in;
                                let resp_PH2 = device.toObject().Wake_out;
                                let resp_N = device.toObject().MesureNbr;

                                if(resp_HD.toString().length === 1)
                                    resp_HD = "0" + resp_HD;
                                if(resp_HF.toString().length === 1)
                                    resp_HF = "0" + resp_HF;
                                if(resp_PH1.toString().length === 1)
                                    resp_PH1 = "00" + resp_PH1;
                                else if(resp_PH1.toString().length === 2)
                                    resp_PH1 = "0" + resp_PH1;
                                if(resp_PH2.toString().length === 1)
                                    resp_PH2 = "00" + resp_PH2;
                                else if(resp_PH2.toString().length === 2)
                                    resp_PH2 = "0" + resp_PH2;


                                let data = {
                                    [SigfoxId] : {"downlinkData": hh + "" + min + "" + resp_HD + "" + resp_HF + "" + resp_PH1 + "" + resp_PH2 + "" + resp_N + "0"},
                                };

                                console.log("DATA : " + hh + min + resp_HD + resp_HF + resp_PH1 + resp_PH2 + resp_N + "0");
                                res.json(data);
                            }

                            return(res.end());
                    });
                } else {
                    return(res.end());
                }
            });
        });
    }
    //si event code == 2 --> fonction de géolocalisation
    else if((event = checkEventCode(req.body)) === 2)
    {
        //ici faut s'occuper de l'event 2 qui permet la récupération d'une localisation avec une info crypté
        let PositionCode = String(req.body.Code.toString().substring(2,22));
        let DeviceId = req.body.DeviceId;

        var req = new XMLHttpRequest();

        req.addEventListener('load', function() {
            var parsed_info = JSON.parse(req.response);
            if(parsed_info.code === "TECHNICAL") {
                console.log("Could not retrieve lat / long of the payload !");
                console.log(parsed_info);
                return(res.end());
            } else {
                req = new XMLHttpRequest();

                req.addEventListener('load', function() {
                    var parsed_get = JSON.parse(req.response);

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


                    Device.find({SigfoxId: DeviceId}, function (err, obj) {
                        if(obj[0] !== undefined && obj[0] != null) { //check if device has been found in database
                            let needDownlink = obj[0].toObject().Downlink;
                            let City = "";
                            if(parsed_get.address.village && parsed_get.address.village !== "" && parsed_get.address.village !== undefined && parsed_get.address.village !== null)
                                City = parsed_get.address.village;
                            else if (parsed_get.address.town && parsed_get.address.town !== "" && parsed_get.address.town !== undefined && parsed_get.address.town !== null)
                                City = parsed_get.address.town;
                            else
                                City = parsed_get.address.city;



                            Device.findOneAndUpdate({SigfoxId: DeviceId}, ({Downlink: 0, PostCode: parsed_get.address.postcode, LastUpdate: dd + "/" + mm + "/" + yyyy + " " + hh + ":" + min, Lon: parsed_info.lng, Lat: parsed_info.lat, City: City, Address: parsed_get.address.road}), {new: true}, function (err, device)
                            {
                                if (err)
                                    console.log(err);

                                //check here lat / lng distance

                                Payload.find({DeviceId: device.toObject().SigfoxId, EventCode: 2}, function (err, payload)
                                {
                                    if (err)
                                        console.log(err);
                                    if(payload !== undefined && payload !== null) {
                                        if(payload[0].toObject().Latitude !== null && payload[0].toObject().Longitude !== null) {

                                            console.log("Last position : " + payload.toObject().Localisation);
                                            console.log("Distance : " + Local.distance(payload[0].toObject().Latitude, payload[0].toObject().Longitude, parsed_info.lat, parsed_info.lng));

                                            if(Local.distance(payload[0].toObject().Latitude, payload[0].toObject().Longitude, parsed_info.lat, parsed_info.lng) > 500) {
                                                let newPayload = new Payload;
                                                newPayload.EventCode = 3;
                                                newPayload.DeviceId = device.toObject().SigfoxId;
                                                newPayload.DateGot = yyyy + "-" + mm + "-" + dd + " " + hh + ":" + min;
                                                newPayload.save();
                                            }
                                        }
                                    }


                                    sendBOT(device.toObject().Name, device.toObject().SigfoxId, device.toObject()._id, "Localisation",  "Latitude : " + parsed_info.lat + " , Longitude : " + parsed_info.lng, dd + "/" + mm + "/" + yyyy + " " + hh + ":" + min,  "#ffbe33");

                                    if(needDownlink === 1) {

                                        //check if is good

                                        let SigfoxId = device.toObject().SigfoxId;

                                        //response in json ???? maybe bad ???
                                        let resp_HD = device.toObject().Phase_start;
                                        let resp_HF = device.toObject().Phase_stop;
                                        let resp_PH1 = device.toObject().Wake_in;
                                        let resp_PH2 = device.toObject().Wake_out;
                                        let resp_N = device.toObject().MesureNbr;

                                        if(resp_HD.toString().length === 1)
                                            resp_HD = "0" + resp_HD;
                                        if(resp_HF.toString().length === 1)
                                            resp_HF = "0" + resp_HF;
                                        if(resp_PH1.toString().length === 1)
                                            resp_PH1 = "00" + resp_PH1;
                                        else if(resp_PH1.toString().length === 2)
                                            resp_PH1 = "0" + resp_PH1;
                                        if(resp_PH2.toString().length === 1)
                                            resp_PH2 = "00" + resp_PH2;
                                        else if(resp_PH2.toString().length === 2)
                                            resp_PH2 = "0" + resp_PH2;


                                        let data = {
                                            [SigfoxId] : {"downlinkData": hh + "" + min + "" + resp_HD + "" + resp_HF + "" + resp_PH1 + "" + resp_PH2 + "" + resp_N + "0"},
                                        };

                                        console.log("DATA : " + hh + min + resp_HD + resp_HF + resp_PH1 + resp_PH2 + resp_N + "0");
                                        res.json(data);
                                    }


                                    let newPayload = new Payload;
                                    newPayload.EventCode = event;
                                    newPayload.Latitude = parsed_info.lat;
                                    newPayload.Longitude = parsed_info.lng;
                                    newPayload.Localisation = parsed_get.address.road + " - " + City;
                                    newPayload.DeviceId = device.toObject().SigfoxId;
                                    newPayload.DateGot = yyyy + "-" + mm + "-" + dd + " " + hh + ":" + min;
                                    newPayload.save();

                                    return(res.end());



                                }).sort('-DateGot').limit(1);
                            });
                        } else {
                            return(res.end());
                        }
                    });
                });

                req.open("GET", "https://eu1.locationiq.org/v1/reverse.php?key=9126593a665608&lat=" + parsed_info.lat + "&lon=" + parsed_info.lng + "&format=json", true);
                req.send(null);
            }
        });
        req.open("POST", "https://api.ubignss.com/position", true);
        req.setRequestHeader("Content-Type", "application/json");
        req.setRequestHeader("Authorization", "Basic aGV5bGlvdF9ldmFsOlJ3ZGpkOnR5MUMyfg==");
        req.send(JSON.stringify({type: "ubiwifi", device: DeviceId, data: PositionCode}));
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
    }).sort('-DateGot');
};

exports.count_payloads = function (req, res)
{
  let id = req.params.appId;
  let type = req.params.type;

  if(type === "all")
  {
      Payload.count({DeviceId: id}, function (err, payload) {
         if(err)
             console.log(err);
         res.json(payload);
      });
  } else {
      Payload.count({DeviceId: id, EventCode: type}, function (err, payload) {
          if(err)
              console.log(err);
          res.json(payload);
      });
  }
};

exports.adv_read_payloads = function (req, res)
{
    let id = req.params.appId;
    let type = req.params.type;
    let start = req.params.start;
    let end = req.params.end;

    if(start < 0 || end < 0)
    {
        if(type === "all") {
            Payload.find({DeviceId: id}, function (err, payload)
            {
                if (err)
                    console.log(err);
                res.json(payload);
            }).sort('-DateGot');
        } else {
            Payload.find({DeviceId: id, EventCode: type}, function (err, payload)
            {
                if (err)
                    console.log(err);
                res.json(payload);
            }).sort('-DateGot');
        }
    } else {
        if(type === "all") {
            Payload.find({DeviceId: id}, function (err, payload)
            {
                if (err)
                    console.log(err);
                res.json(payload);
            }).sort('-DateGot').skip(Number(start)).limit(Number(end));
        } else {
            Payload.find({DeviceId: id, EventCode: type}, function (err, payload)
            {
                if (err)
                    console.log(err);
                res.json(payload);
            }).sort('-DateGot').skip(Number(start)).limit(Number(end));
        }
    }
};

exports.advb_read_payloads = function (req, res)
{
    let type = req.params.type;
    let nbr = req.params.nbr;

    if(nbr < 0)
    {
        if(type === "all") {
            Payload.find({}, function (err, payload)
            {
                if (err)
                    res.send(err);
                res.json(payload);
            }).sort('-DateGot');
        } else {
            Payload.find({EventCode: type}, function (err, payload)
            {
                if (err)
                    res.send(err);
                res.json(payload);
            }).sort('-DateGot');
        }
    } else {
        if(type === "all") {
            Payload.find({}, function (err, payload)
            {
                if (err)
                    res.send(err);
                res.json(payload);
            }).sort('-DateGot').limit(Number(nbr));
        } else {
            Payload.find({EventCode: type}, function (err, payload)
            {
                if (err)
                    res.send(err);
                res.json(payload);
            }).sort('-DateGot').limit(Number(nbr));
        }
    }
};

exports.get_last_com = function (req, res)
{

    let DevicesList = JSON.parse(JSON.stringify(req.body));
    var list = [];
    var p_do = 0;

    let i = 0;

    for(var p in DevicesList) {
        i++;
    }

    for (var p in DevicesList) {
        let element = DevicesList[p];
        Payload.find({DeviceId: element}, {__v: 0, Localisation: 0}, function (err, device)
        {
            p_do++;
            if (err)
            {
                console.log("Error at : " + err);
                res.send(err);
            }
            list.push(device);

            if(p_do === i) {
                res.json(list);
            }
        }).sort('-DateGot').limit(1);

    }
};

exports.read_payload = function (req, res) //GET payloads grace a leurs ID
{
    console.log("Reading a paylaod");

    Payload.find({DeviceId: req.params.appId}, function (err, payload)
    {
        if (err)
            res.send(err);
        res.json(payload);
    }).sort('-DateGot');

};


exports.update_payload = function (req, res) //PUT Editer le payload spécifié
{
    console.log("Updating a payload");

    Payload.findOneAndUpdate({_id: req.params.appId}, (req.body), {new: true}, function (err, payload)
    {
        if (err)
            res.send(err);
        res.json(payload);
    });

};


exports.delete_payload = function (req, res) //DELETE le payload specifié
{
    console.log("Deleting a specified device");

    Payload.remove({_id: req.params.appId}, function (err, payload)
    {
        if (err)
            res.send(err);
        res.json({message: "Payload successfully  deleted"});
    });
};



function sendBOT(Name, SigFoxId, id, Signal, Information, Date, Color)
{
    let req = new XMLHttpRequest();
    let data = JSON.stringify({
        "channel" : Name,
        "attachments": [{
            "fallback": "Capteur : " + Name + " SigfoxId : " + SigFoxId + " <http://app.heyliot.com/devices/view/" + id + "|Voir le device>",
            "pretext":"Capteur : " + Name + " SigfoxId : " + SigFoxId + " <http://app.heyliot.com/devices/view/" + id + "|Voir le device>",
            "color": Color,
            "fields":[
                {
                    "title":"Informations",
                    "value":"Type de signal : " + Signal + " \n Information : " + Information + "\n Date : " + Date + "",
                    "short":false
                }
            ]
        }]
    });

    req.open("POST", "https://hooks.slack.com/services/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", true);
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    req.send('payload=' + data);
}