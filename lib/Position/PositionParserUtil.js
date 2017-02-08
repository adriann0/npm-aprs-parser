'use strict';

module.exports = {
    fromDMStoDecimalLatitude: function (latitude) {
        //position ambiguity, replace spaces
        latitude = latitude.replace(" ", "0");

        if (latitude.length != 8 || latitude[4] != '.' || !(latitude[7] == 'N' || latitude[7] == 'S')) {
            throw "Wrong latitude format";
        }

        var degrees = parseInt(latitude.substr(0, 2));
        var minutes = parseInt(latitude.substr(2, 2));
        var seconds = parseInt(latitude.substr(5, 2));
        var north = latitude[7] == 'N' ? 1 : -1;

        if (isNaN(degrees) || isNaN(minutes || isNaN(seconds))) {
            throw "Not numbers in position";
        }

        return (degrees + minutes / 60 + seconds / 3600) * north;
    },

    fromDMStoDecimalLongitude: function (longitude) {
        //position ambiguity, replace spaces
        longitude = longitude.replace(" ", "0");

        if (longitude.length != 9 || longitude[5] != '.' || !(longitude[8] == 'E' || longitude[8] == 'W')) {
            throw "Wrong latitude format";
        }

        var degrees = parseInt(longitude.substr(0, 3));
        var minutes = parseInt(longitude.substr(3, 2));
        var seconds = parseInt(longitude.substr(6, 2));
        var east = longitude[8] == 'E' ? 1 : -1;

        if (isNaN(degrees) || isNaN(minutes || isNaN(seconds))) {
            throw "Not numbers in position";
        }

        return (degrees + minutes / 60 + seconds / 3600) * east;
    },

    feetsToMeters: function (feets) {
        return feets * 0.3048;
    }
};