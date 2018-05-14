'use strict'

function Position(lon, lat)
{
    this.lon = lon; //Longitude
    this.lat = lat; //Latitude
    console.log("Created Class with Longitude: " + this.lon + " and latitude: " + this.lat);
}


// ------GETTERS------
Position.prototype.getLon = function (){ return(this.lon);};

Position.prototype.getLat = function (){ return(this.lat);};


//------SETTERS-------
Position.prototype.setLat = function (val) {this.lat = val};

Position.prototype.setLon = function (val){ this.lon = val};


//Verifie si les valeurs sont sets
Position.prototype.isEmpty = function ()
{
    if (this.lon == null || this.lat == null)
        return(false);
    return(true);
}

module.exports = Position;