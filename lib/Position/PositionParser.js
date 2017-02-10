'use strict';
var PositionParserUtil = require("./PositionParserUtil.js");
var AbstractParser = require("../AbstractParser.js");
var Position = require("./../MessageModels/Position.js");

function PositionParser() {

}

var tryParseExtension = function (potentialExtensionData) {
    //TODO: extension parsing
};

var extractAltitudeMeters = function (msgWithExtension) {
    var altitudeMark = "/A=";

    var altPos = msgWithExtension.indexOf(altitudeMark);
    if (altPos > 0) {
        var altitudeString = msgWithExtension.substr(altPos + altitudeMark.length, 6);
        var altitudeFeets = parseInt(altitudeString);
        if (isNaN(altitudeFeets) || !altitudeString.match("^[0-9]{6,6}$")) {
            throw new Error("Error when parsing altitude");
        }

        msgWithExtension = msgWithExtension.replace(altitudeMark + altitudeString, "").trim();

        return {msg: msgWithExtension, altitude: PositionParserUtil.feetsToMeters(altitudeFeets)};
    }
};

PositionParser.constructor = PositionParser;
PositionParser.prototype = Object.create(AbstractParser.prototype);

PositionParser.prototype.isMatching = function (bodyContent) {
    var first = bodyContent[0];
    return first == "!" || first == "=" || first == "/" || first == "@";
};

PositionParser.prototype.tryParse = function (bodyContent, aprsMessageHeader) {
    var messagingEnabled = bodyContent[0] == "=" || bodyContent[0] == "@";
    var timestamp;
    var contentWithoutTimestamp = bodyContent;

    //remove distinguisher char and/or timestamp
    if (bodyContent[0] == "@" || bodyContent[0] == "/") {
        //with timestamp
        timestamp = bodyContent.substr(1, 7);
        contentWithoutTimestamp = bodyContent.substr(8);
    } else {
        contentWithoutTimestamp = bodyContent.substr(1);
    }

    var latitudeString = contentWithoutTimestamp.substr(0, 8);
    var longitudeString = contentWithoutTimestamp.substr(9, 9);
    var symbol = contentWithoutTimestamp[8] + contentWithoutTimestamp[18];

    var position = new Position(PositionParserUtil.fromDMStoDecimalLatitude(latitudeString), PositionParserUtil.fromDMStoDecimalLongitude(longitudeString));

    if (timestamp) {
        position.setTimestamp(timestamp);
    }

    position.setSymbol(symbol);
    position.setMessagingEnabled(messagingEnabled);

    //remove parsed data (timestamp, position, symbol, whether messaging enabled)
    var msgWithExtension = contentWithoutTimestamp.substr(19);
    var msgWithoutExtension = msgWithExtension;

    var extensionData = tryParseExtension(msgWithExtension.substr(0, 7));
    if (extensionData) {
        //extension found
        position.setExtension(extensionData);
        //remove info about extension for further parsing
        msgWithoutExtension = msgWithExtension.substr(7);
    }

    var altitudeInfo = extractAltitudeMeters(msgWithoutExtension);
    if (altitudeInfo) {
        msgWithoutExtension = altitudeInfo.msg;
        position.setAltitude(altitudeInfo.altitude);
    }

    position.setComment(msgWithoutExtension);

    return position;
};

module.exports = PositionParser;