'use strict'

exports.crypted = function (req, res) {

    console.log("Decrypt a location, CODE : " + req.body.PositionCode);

    var PositionCode = String(req.body.PositionCode);

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
};

exports.uncrypted = function (req, res) {

    console.log("getting information with location... LAT : " + req.body.Lat + " , LON : " + req.body.Lon);

    let Lat = req.body.Lat;
    let Lon = req.body.Lon;

    req = new XMLHttpRequest();

    req.addEventListener('load', function() {
        var parsed_get = JSON.parse(req.response);
        res.json({lat: Lat, long: Lon, city: parsed_get.address.village, address: parsed_get.address.road, postcode: parsed_get.address.postcode});
    });

    req.open("GET", "https://eu1.locationiq.org/v1/reverse.php?key=9126593a665608&lat=" + Lat + "&lon=" + Lon + "&format=json", true);
    req.send(null);
}