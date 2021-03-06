'use strict';

let Permission = require('./PermissionsController');

exports.crypted = function (req, res)
{
    var PositionCode = String(req.body.PositionCode);
            var req = new XMLHttpRequest();
            req.addEventListener('load', function() {
                var parsed_info = JSON.parse(req.response);
                if(parsed_info.code === "TECHNICAL") {
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
};

exports.uncrypted = function (req, res) {
            let Lat = req.body.Lat;
            let Lon = req.body.Lon;

            req = new XMLHttpRequest();

            req.addEventListener('load', function() {
                var parsed_get = JSON.parse(req.response);
                res.json({lat: Lat, long: Lon, city: parsed_get.address.village, address: parsed_get.address.road, postcode: parsed_get.address.postcode});
            });

            req.open("GET", "https://eu1.locationiq.org/v1/reverse.php?key=9126593a665608&lat=" + Lat + "&lon=" + Lon + "&format=json", true);
            req.send(null);
};


exports.distance = function distance(lat1, lon1, lat2, lon2) {
    let radlat1 = Math.PI * lat1/180;
    let radlat2 = Math.PI * lat2/180;
    let theta = lon1-lon2;
    let radtheta = Math.PI * theta/180;
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
        dist = 1;
    }
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * 1.609344
    return dist
};


exports.road = function (req, res) {
            if(req.body.locations) {
                const exec = require('child_process').exec;
                const child = exec(__dirname + '\\RoadAPI.py "' + req.body.locations + '"',
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
};