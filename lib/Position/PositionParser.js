'use strict';
var PositionParserUtil = require("./PositionParserUtil.js");
var CompressedPositionUtil = require("./CompressedPositionUtil.js");
var AbstractParser = require("../AbstractParser.js");
var Position = require("./../MessageModels/Position.js");

function PositionParser() {

}

var tryParseNotCompressed = function (contentWithoutTimestamp) {
    var symbol = contentWithoutTimestamp[8] + contentWithoutTimestamp[18];
    var latitudeString = contentWithoutTimestamp.substr(0, 8);
    var longitudeString = contentWithoutTimestamp.substr(9, 9);

    var position = new Position(PositionParserUtil.fromDMtoDecimalLatitude(latitudeString), PositionParserUtil.fromDMtoDecimalLongitude(longitudeString));

    position.setSymbol(symbol);
    return position;
};

var tryParseCompressed = function (contentWithoutTimestamp) {
    return CompressedPositionUtil.getPositionForCompressedString(contentWithoutTimestamp);
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

    var position;
    var comment;

    if (isNaN(parseInt(contentWithoutTimestamp[0]))) {
        //probably compressed format
        position = tryParseCompressed(contentWithoutTimestamp.substr(0, 13));
        comment = contentWithoutTimestamp.substr(13);
    }
    else {
        //probably not compressed
        position = tryParseNotCompressed(contentWithoutTimestamp.substr(0, 19));
        comment = contentWithoutTimestamp.substr(19);
    }

    if (comment && comment.length > 0) {
        var parsedFromComment = PositionParserUtil.parseAltitudeAndExtension(comment);

        if (parsedFromComment.extension)
            position.setExtension(parsedFromComment.extension);

        if (parsedFromComment.altitude)
            position.setAltitude(parsedFromComment.altitude);

        if (parsedFromComment.comment)
            position.setComment(parsedFromComment.comment);
    }

    if (timestamp) {
        position.setTimestamp(timestamp);
    }

    position.setMessagingEnabled(messagingEnabled);

    return position;
};

PositionParser.prototype.getParserName = function () {
    return "PositionParser";
};

module.exports = PositionParser;