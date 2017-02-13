'use strict';

module.exports = {
    fromDMtoDecimalLatitude: function (latitude) {
        //position ambiguity, replace spaces
        latitude = latitude.replace(" ", "0");

        if (latitude.length != 8 || latitude[4] != '.' || !(latitude[7] == 'N' || latitude[7] == 'S')) {
            throw new Error("Wrong latitude format: " + latitude);
        }

        var degrees = parseInt(latitude.substr(0, 2));
        var minutes = parseInt(latitude.substr(2, 2)) + parseInt(latitude.substr(5, 2)) / 100;
        var north = latitude[7] == 'N' ? 1 : -1;

        if (isNaN(degrees) || isNaN(minutes)) {
            throw "Not numbers in position";
        }

        return (degrees + minutes / 60) * north;
    },

    fromDMtoDecimalLongitude: function (longitude) {
        //position ambiguity, replace spaces
        longitude = longitude.replace(" ", "0");

        if (longitude.length != 9 || longitude[5] != '.' || !(longitude[8] == 'E' || longitude[8] == 'W')) {
            throw new Error("Wrong longitude format: " + longitude);
        }

        var degrees = parseInt(longitude.substr(0, 3));
        var minutes = parseInt(longitude.substr(3, 2)) + parseInt(longitude.substr(6, 2)) / 100;
        var east = longitude[8] == 'E' ? 1 : -1;

        if (isNaN(degrees) || isNaN(minutes)) {
            throw new Error("Not numbers in position");
        }

        return (degrees + minutes / 60) * east;
    },

    feetsToMeters: function (feets) {
        return feets * 0.3048;
    },

    extractAltitudeMeters: function (msgWithExtension) {
        var altitudeMark = "/A=";

        var altPos = msgWithExtension.indexOf(altitudeMark);
        if (altPos >= 0) {
            var altitudeString = msgWithExtension.substr(altPos + altitudeMark.length, 6);
            var altitudeFeets = parseInt(altitudeString);
            if (isNaN(altitudeFeets) || !altitudeString.match("^[0-9]{6,6}$")) {
                throw new Error("Error when parsing altitude");
            }

            msgWithExtension = msgWithExtension.replace(altitudeMark + altitudeString, "").trim();

            return {msg: msgWithExtension, altitude: this.feetsToMeters(altitudeFeets)};
        }
    },

    tryParseExtension: function (potentialExtensionData) {
        //if not found return nothing
    },

    parseAltitudeAndExtension: function (comment) {
        var msgWithoutExtension = comment;
        var extension;
        var altitude;

        var extensionData = this.tryParseExtension(comment.substr(0, 7));
        if (extensionData) {
            extension = extensionData;
            //remove info about extension for further parsing
            msgWithoutExtension = comment.substr(7);
        }

        var altitudeInfo = this.extractAltitudeMeters(msgWithoutExtension);
        if (altitudeInfo) {
            msgWithoutExtension = altitudeInfo.msg;
            altitude = altitudeInfo.altitude
        }

        comment = msgWithoutExtension;

        var ret = {};
        if (altitude)
            ret["altitude"] = altitude;

        if (extension)
            ret["extension"] = extension;

        if (comment && comment.length > 0)
            ret["comment"] = comment;

        return ret;
    }
};