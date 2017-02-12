'use strict';
var AbstractParser = require("../AbstractParser.js");
var ObjectPosition = require("../MessageModels/ObjectPosition.js");
var Utils = require("../Position/PositionParserUtil.js");

function ObjectParser() {

}


ObjectParser.constructor = ObjectParser;
ObjectParser.prototype = Object.create(AbstractParser.prototype);

ObjectParser.prototype.isMatching = function (bodyContent) {
    var first = bodyContent[0];
    return first == ";";
};

ObjectParser.prototype.tryParse = function (bodyContent, aprsMessageHeader) {
    if (bodyContent.length < 37) {
        throw new Error("Length < 37");
    }

    var name = bodyContent.substr(1, 9).trim();
    var status;
    var timestamp;

    if (bodyContent[10] == "*")
        status = ObjectPosition.Status.LIVE;
    else if (bodyContent[10] == "_")
        status = ObjectPosition.Status.KILLED;
    else
        throw new Error("Wrong status symbol");

    timestamp = bodyContent.substr(11, 7);

    var latitude = Utils.fromDMtoDecimalLatitude(bodyContent.substr(18, 8));
    var longitude = Utils.fromDMtoDecimalLongitude(bodyContent.substr(27, 9));
    var symbol = bodyContent[26] + bodyContent[36];

    var objectPos = new ObjectPosition(name, status, latitude, longitude);
    objectPos.setTimestamp(timestamp);
    objectPos.setSymbol(symbol);

    var parsedFromComment = Utils.parseAltitudeAndExtension(bodyContent.substr(37));

    if (parsedFromComment.extension)
        objectPos.setExtension(parsedFromComment.extension);

    if (parsedFromComment.altitude)
        objectPos.setAltitude(parsedFromComment.altitude);

    if (parsedFromComment.comment)
        objectPos.setComment(parsedFromComment.comment);

    return objectPos;
};

ObjectParser.prototype.getParserName = function () {
    return "ObjectParser";
};

module.exports = ObjectParser;