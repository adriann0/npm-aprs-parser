'use strict';
var AbstractParser = require("../AbstractParser.js");
var ObjectPosition = require("../MessageModels/ObjectPosition.js");

var PositionParserUtil = require("../Position/PositionParserUtils.js");

function ObjectParser() {

}

ObjectParser.constructor = ObjectParser;
ObjectParser.prototype = Object.create(AbstractParser.prototype);

ObjectParser.prototype.isMatching = function (bodyContent) {
    var first = bodyContent[0];
    return first == ";";
};

ObjectParser.prototype.tryParse = function (bodyContent, aprsMessageHeader) {
    var name = bodyContent.substr(1, 9).trim();
    var status;
    var timestamp;

    if (bodyContent[10] == "*")
        status = ObjectPosition.Status.LIVE;
    else if (bodyContent[10] == "_")
        status = ObjectPosition.Status.KILLED;
    else
        throw new Error("Wrong status symbol: " + bodyContent[10]);

    timestamp = PositionParserUtil.parseTimestamp(bodyContent.substr(11, 7));

    var dataWithoutTimestampString = bodyContent.substr(18);

    var objectPos = new ObjectPosition(name, status, 0.0, 0.0);
    Object.assign(objectPos, PositionParserUtil.parsePositionAndCommentString(dataWithoutTimestampString));

    objectPos.setTimestamp(timestamp);

    return objectPos;
};

ObjectParser.prototype.getParserName = function () {
    return "ObjectParser";
};

module.exports = ObjectParser;