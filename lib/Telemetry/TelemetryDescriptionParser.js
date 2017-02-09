'use strict';
var AbstractParser = require("../AbstractParser.js");
var MessageParser = require("../Message/MessageParser");

var TelemetryDescription = require("./TelemetryDescription.js");

function TelemetryDescriptionParser() {
}

TelemetryDescriptionParser.constructor = TelemetryDescriptionParser;
TelemetryDescriptionParser.prototype = Object.create(AbstractParser.prototype);

TelemetryDescriptionParser.prototype.isMatching = function (bodyContent) {
    return !!bodyContent.match("^:.{9,9}:PARM.");
};

TelemetryDescriptionParser.prototype.tryParse = function (bodyContent) {
    var messageParser = new MessageParser();
    var message = messageParser.tryParse(bodyContent);

    var descriptions = message.text.substr(5).split(",");

    if (descriptions.length > 13)
        throw new Error("Too many description fields");

    return new TelemetryDescription(message.addressee.toString(), descriptions);
};

module.exports = TelemetryDescriptionParser;