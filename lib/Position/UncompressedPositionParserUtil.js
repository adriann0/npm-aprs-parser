'use strict';

const WeatherParserUtils = require('./WeatherParserUtils');
const Base91ParserUtils = require('./Base91ParserUtils');

module.exports = {
    fromDMtoDecimalLatitude: function (latitude) {
        //position ambiguity, replace spaces
        latitude = latitude.replace(' ', '0');

        if (latitude.length != 8 || latitude[4] != '.' || !(latitude[7] == 'N' || latitude[7] == 'S')) {
            throw new Error('Wrong latitude format: ' + latitude);
        }

        const degrees = parseInt(latitude.substr(0, 2));
        const minutes = parseInt(latitude.substr(2, 2)) + parseInt(latitude.substr(5, 2)) / 100;
        const north = latitude[7] == 'N' ? 1 : -1;

        if (isNaN(degrees) || isNaN(minutes)) {
            throw 'Not numbers in position';
        }

        return (degrees + minutes / 60) * north;
    },

    fromDMtoDecimalLongitude: function (longitude) {
        //position ambiguity, replace spaces
        longitude = longitude.replace(' ', '0');

        if (longitude.length != 9 || longitude[5] != '.' || !(longitude[8] == 'E' || longitude[8] == 'W')) {
            throw new Error('Wrong longitude format: ' + longitude);
        }

        const degrees = parseInt(longitude.substr(0, 3));
        const minutes = parseInt(longitude.substr(3, 2)) + parseInt(longitude.substr(6, 2)) / 100;
        const east = longitude[8] == 'E' ? 1 : -1;

        if (isNaN(degrees) || isNaN(minutes)) {
            throw new Error('Not numbers in position');
        }

        return (degrees + minutes / 60) * east;
    },

    feetsToMeters: function (feets) {
        return feets * 0.3048;
    },

    knotsToMetersPerSecond: function (knots) {
        return knots * 0.514444444;
    },

    milesToMeters: function (miles) {
        return miles * 1.609344 * 1000;
    },

    extractAltitudeMeters: function (msgWithExtension) {
        const altitudeMark = '/A=';

        const altPos = msgWithExtension.indexOf(altitudeMark);
        if (altPos >= 0) {
            const altitudeString = msgWithExtension.substr(altPos + altitudeMark.length, 6);
            const altitudeFeets = parseInt(altitudeString);
            if (isNaN(altitudeFeets) || !altitudeString.match('^[0-9]{6,6}$')) {
                throw new Error('Error when parsing altitude');
            }

            msgWithExtension = msgWithExtension.replace(altitudeMark + altitudeString, '').trim();

            return {msg: msgWithExtension, altitude: this.feetsToMeters(altitudeFeets)};
        }
    },

    tryParseExtension: function (potentialExtensionData) {
        const ExtensionParser = new require('../PostionExtensions/ExtensionParser');
        const extensionParser = new ExtensionParser();

        //if not found return nothing
        if(extensionParser.isMatching(potentialExtensionData)) {
            return extensionParser.tryParse(potentialExtensionData, null);
        }
    },

    parseAltitudeWeatherAndExtension: function (comment) {
        let msgWithoutExtension = comment;
        let extension;
        let altitude;
        let telemetry;

        const extensionData = this.tryParseExtension(comment.substr(0, 7));
        if (extensionData) {
            extension = extensionData;
            //remove info about extension for further parsing
            msgWithoutExtension = comment.substr(7);
        }

        const altitudeInfo = this.extractAltitudeMeters(msgWithoutExtension);
        if (altitudeInfo) {
            msgWithoutExtension = altitudeInfo.msg;
            altitude = altitudeInfo.altitude;
        }

        comment = msgWithoutExtension;


        const ret = {};

        const weatherData = WeatherParserUtils.parseWeatherData(comment);
        if (weatherData) {
            comment = weatherData.comment;
            ret['weather'] = weatherData.weather;
        }
        const base91TelemetryData = Base91ParserUtils.parseBase91Telemetry(comment);
        if (base91TelemetryData) {
            comment = base91TelemetryData.comment;
            ret['telemetry'] = base91TelemetryData.telemetry;
        }

        if (altitude)
            ret['altitude'] = altitude;

        if (extension)
            ret['extension'] = extension;            

        if (comment && comment.length > 0)
            ret['comment'] = comment;

        return ret;
    }
};