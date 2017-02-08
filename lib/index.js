var APRSMessage = require("./APRSMessage.js");
var Callsign = require("./Callsign.js");

var PositionParser = require("./Position/PositionParser.js");
var MessageParser = require("./Message/MessageParser.js");
var TelemetryParser = require("./Telemetry/TelemetryParser.js");

var parseHeader = function (messageHeaderString) {
    var destinationDelimiterPos = messageHeaderString.indexOf(">");

    if (destinationDelimiterPos < 0) {
        throw new Error("Malformed header");
    }

    var fromCallsignString = messageHeaderString.substr(0, destinationDelimiterPos);

    var toAndDigiString = messageHeaderString.substr(destinationDelimiterPos + 1);
    var toAndDigiDelimiterPos = toAndDigiString.indexOf(",");

    var toCallsignString = "";
    var digiArray = [];

    if (toAndDigiDelimiterPos < 0) {
        toCallsignString = toAndDigiString;
        digiArray = [];
    }
    else {
        toCallsignString = toAndDigiString.substr(0, toAndDigiDelimiterPos);
        digiArray = toAndDigiString.substr(toAndDigiDelimiterPos + 1).split(',');
    }

    return new APRSMessage(new Callsign(fromCallsignString), new Callsign(toCallsignString), digiArray.map(function (obj) {
        return new Callsign(obj);
    }));
};

var parseBody = function (messageBodyString, aprsMessage, matchingParser) {
    var parsedData = matchingParser.tryParse(messageBodyString);

    if (parsedData) {
        aprsMessage.setBody(parsedData);
    }

    return aprsMessage;
};

function APRSParser() {
    this.parsers = [new PositionParser(), new MessageParser()];
}

APRSParser.prototype.parse = function (messageContent) {
    var headerDelimiterPos = messageContent.indexOf(":");

    if (headerDelimiterPos < 0) {
        throw new Error("Header - body delimiter not found");
    }

    var messageBodyString = messageContent.substr(headerDelimiterPos + 1);
    var messageHeaderString = messageContent.substr(0, headerDelimiterPos);

    var aprsMessage = parseHeader(messageHeaderString);
    aprsMessage.raw = messageContent;

    var selectedParser;
    var firstLetterOfBody = messageBodyString.substr(0, 1);

    for (var i = 0; i < this.parsers.length; i++) {
        var parser = this.parsers[i];

        if (parser.isMatching(firstLetterOfBody)) {
            selectedParser = parser;
            break;
        }
    }

    if (!selectedParser) {
        throw new Error("No matching parsers");
    }

    return parseBody(messageBodyString, aprsMessage, selectedParser);
};

module.exports = APRSParser;