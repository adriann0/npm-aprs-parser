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

    knotsToMetersPerSecond: function (knots) {
        return knots * 0.514444444;
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
        var ExtensionParser = new require("../PostionExtensions/ExtensionParser");
        var extensionParser = new ExtensionParser();

        //if not found return nothing
        if(extensionParser.isMatching(potentialExtensionData)) {
            return extensionParser.tryParse(potentialExtensionData, null);
        }
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
            altitude = altitudeInfo.altitude;
        }

        comment = msgWithoutExtension;

        var ret = {};

        var weatherMatches = comment.match(/([cSgtrpPlLs#]\d{3}|t-\d{2}|h\d{2}|b\d{5}|s\.\d{2}|s\d\.\d)/g);
        if (weatherMatches && weatherMatches.length > 1) {

            var wind_multiplier = 0.44704;
            var rain_multiplier = 0.254;

            var key_map = {
                'g': 'wind_gust',
                'c': 'wind_direction',
                't': 'temperature',
                'S': 'wind_speed',
                'r': 'rain_1h',
                'p': 'rain_24h',
                'P': 'rain_since_midnight',
                'h': 'humidity',
                'b': 'pressure',
                'l': 'luminosity',
                'L': 'luminosity',
                's': 'snow',
                '#': 'rain_raw',
            };

            var val_map = {
                'g': x => { return Number(x) * wind_multiplier; },
                'c': x => { return Number(x); },
                'S': x => { return Number(x) * wind_multiplier; },
                't': x => { return (Number(x) - 32) / 1.8; },
                'r': x => { return Number(x) * rain_multiplier; },
                'p': x => { return Number(x) * rain_multiplier; },
                'P': x => { return Number(x) * rain_multiplier; },
                'h': x => { return Number(x); },
                'b': x => { return Number(x) / 10; },
                'l': x => { return Number(x) + 1000; },
                'L': x => { return Number(x); },
                's': x => { return Number(x) * 25.4; },
                '#': x => { return Number(x); }

            };

            ret["weather"] = {};

            for (let i = 0; i < weatherMatches.length; i++){
                ret["weather"][key_map[weatherMatches[i].substr(0, 1)]] = val_map[weatherMatches[i].substr(0, 1)](weatherMatches[i].substr(1));
            }

            comment = comment.substr(comment.indexOf(weatherMatches[weatherMatches.length - 1]) + weatherMatches[weatherMatches.length - 1].length);

        }

        if (altitude)
            ret["altitude"] = altitude;

        if (extension)
            ret["extension"] = extension;

        if (comment && comment.length > 0)
            ret["comment"] = comment;

        return ret;
    }
};