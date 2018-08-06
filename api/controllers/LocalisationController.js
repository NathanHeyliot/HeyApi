'use strict';

let Permission = require('./PermissionsController');

exports.crypted = function (req, res)
{
    Promise.all([req, Permission.hasPermission("API_LOCALISATION_POSTCRYPTED", req)]).then(data => {
        if(data[1] === true) {
            console.log("Decrypt a location, CODE : " + data[0].body.PositionCode);
            var PositionCode = String(data[0].body.PositionCode);
            var req = new XMLHttpRequest();
            req.addEventListener('load', function() {
                var parsed_info = JSON.parse(req.response);
                if(parsed_info.code === "TECHNICAL") {
                    console.log("Could not retrieve lat / long !");
                    console.log(parsed_info);
                    res.json({message: "Error with API"});
                } else {
                    req = new XMLHttpRequest();

                    req.addEventListener('load', function() {
                        var parsed_get = JSON.parse(req.response);
                        res.json({lat: parsed_info.lat, long: parsed_info.lng, accuracy: parsed_info.accuracy, city: parsed_get.address.village, address: parsed_get.address.road, postcode: parsed_get.address.postcode});
                    });
                    req.open("GET", "https://eu1.locationiq.org/v1/reverse.php?key=9126593a665608&lat=" + parsed_info.lat + "&lon=" + parsed_info.lng + "&format=json", true);
                    req.send(null);
                }
            });
            req.open("POST", "https://api.ubignss.com/position", true);
            req.setRequestHeader("Content-Type", "application/json");
            req.setRequestHeader("Authorization", "Basic aGV5bGlvdF9ldmFsOlJ3ZGpkOnR5MUMyfg==");
            req.send(JSON.stringify({type: "ubiwifi", device: "NoDeviceSpecified", data: PositionCode}));
        } else {
            res.json({error: "No Permission to do that !"});
        }
    });
};

exports.uncrypted = function (req, res) {

    Promise.all([
        req,
        Permission.hasPermission("API_LOCALISATION_POSTUNCRYPTED", req),
        Permission.hasPermission("API_BYPASS_POST", req)
    ]).then(data => {
        if(data[1] === true) {
            console.log("getting information with location... LAT : " + req.body.Lat + " , LON : " + req.body.Lon);

            let Lat = data[0].body.Lat;
            let Lon = data[0].body.Lon;

            req = new XMLHttpRequest();

            req.addEventListener('load', function() {
                var parsed_get = JSON.parse(req.response);
                res.json({lat: Lat, long: Lon, city: parsed_get.address.village, address: parsed_get.address.road, postcode: parsed_get.address.postcode});
            });

            req.open("GET", "https://eu1.locationiq.org/v1/reverse.php?key=9126593a665608&lat=" + Lat + "&lon=" + Lon + "&format=json", true);
            req.send(null);
        } else {
            res.json({error: "No Permission to do that !"});
        }
    });
};

exports.road = function (req, res) {

    Promise.all([
        req,
        Permission.hasPermission("API_PAYLOADS_ROADPOST", req),
        Permission.hasPermission("API_BYPASS_POST", req)
    ]).then(data => {
        if(data[1] === true || data[2] === true) {
            console.log("useing API for road");

            if(data[0].body.locations) {
                const exec = require('child_process').exec;
                const child = exec(__dirname + '\\RoadAPI.py "' + data[0].body.locations + '"',
                    (error, stdout, stderr) => {
                        if(stdout) {
                            console.log(`Sortie du script : ${stdout}`);
                            res.json(JSON.parse(stdout));
                        }
                        if(stderr)
                            console.log(`Erreur trouvée : ${stderr}`);
                        if (error !== null) {
                            console.log(`exec error: ${error}`);
                        }
                    });
            } else {
                console.log("No location give :/");
            }
        } else {
            res.json({error: "No Permission to do that !"});
        }
    });
};