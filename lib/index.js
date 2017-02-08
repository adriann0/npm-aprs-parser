var APRSMessage = require("./APRSMessage.js");
var Callsign = require("./Callsign.js");

var parseHeader = function (messageHeaderString) {
    var destinationDelimiterPos = messageHeaderString.indexOf(">");

    if (destinationDelimiterPos < 0) {
        throw "Malformed header";
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

var parseBody = function (messageBodyString, aprsMessage) {
    var content;


    aprsMessage.data = content;
    return aprsMessage;
};

function APRSParser() {
}

APRSParser.prototype.parse = function (messageContent) {
    var headerDelimiterPos = messageContent.indexOf(":");

    if (headerDelimiterPos < 0) {
        throw "Header - body delimiter not found";
    }

    var messageBodyString = messageContent.substr(headerDelimiterPos + 1);
    var messageHeaderString = messageContent.substr(0, headerDelimiterPos);

    var aprsMessage = parseHeader(messageHeaderString);
    aprsMessage.raw = messageContent;
    return parseBody(messageBodyString, aprsMessage);
};

module.exports = APRSParser;