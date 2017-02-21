'use strict';

var AbstractParser = require("../AbstractParser.js");
var PositionParserUtils = require("./PositionParserUtils.js");


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
        timestamp = PositionParserUtils.parseTimestamp(bodyContent.substr(1, 7));
        contentWithoutTimestamp = bodyContent.substr(8);
    } else {
        contentWithoutTimestamp = bodyContent.substr(1);
    }

    var positionObject = PositionParserUtils.parsePositionAndCommentString(contentWithoutTimestamp);

    if (timestamp) {
        positionObject.setTimestamp(timestamp);
    }

    positionObject.setMessagingEnabled(messagingEnabled);

    return positionObject;
};

PositionParser.prototype.getParserName = function () {
    return "PositionParser";
};

module.exports = PositionParser;