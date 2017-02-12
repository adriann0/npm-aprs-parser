'use strict';
var PositionParserUtil = require("./PositionParserUtil.js");
var AbstractParser = require("../AbstractParser.js");
var Position = require("./../MessageModels/Position.js");

function PositionParser() {

}


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

    var position = new Position(PositionParserUtil.fromDMtoDecimalLatitude(latitudeString), PositionParserUtil.fromDMtoDecimalLongitude(longitudeString));

    if (timestamp) {
        position.setTimestamp(timestamp);
    }

    position.setSymbol(symbol);
    position.setMessagingEnabled(messagingEnabled);

    var parsedFromComment = PositionParserUtil.parseAltitudeAndExtension(contentWithoutTimestamp.substr(19));

    if (parsedFromComment.extension)
        position.setExtension(parsedFromComment.extension);

    if (parsedFromComment.altitude)
        position.setAltitude(parsedFromComment.altitude);

    if (parsedFromComment.comment)
        position.setComment(parsedFromComment.comment);

    return position;
};

PositionParser.prototype.getParserName = function () {
    return "PositionParser";
};

module.exports = PositionParser;