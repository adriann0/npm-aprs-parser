'use strict';
var AbstractParser = require("../AbstractParser.js");

var Telemetry = require("./../MessageModels/Telemetry.js");

function TelemetryParser() {
}

TelemetryParser.constructor = TelemetryParser;
TelemetryParser.prototype = Object.create(AbstractParser.prototype);

TelemetryParser.prototype.isMatching = function (bodyContent) {
    return bodyContent[0] == "T";
};

TelemetryParser.prototype.tryParse = function (bodyContent, aprsMessageHeader) {
    var commaSeparated = bodyContent.split(",");

    if (commaSeparated.length != 7 || !commaSeparated[0].match("T#[0-9]{3,3}")) {
        throw new Error("Wrong telemetry format");
    }

    var id = parseInt(commaSeparated[0].substr(2));

    var analogValues = commaSeparated.slice(1, 6).map(function (value) {
        var numericValue = parseInt(value);
        if (!value.match("^[0-9]{3,3}$") || value > 255 || value < 0)
            throw new Error("Wrong analog value");

        return numericValue;
    });

    var digitalString = commaSeparated[6];

    var comment;
    if (digitalString.length > 8) {
        //have comment, remove it
        comment = digitalString.substr(8);
        digitalString = digitalString.substr(0, 8);
    }

    var digitalValues = digitalString.split('').map(function (value) {
        if (value != '0' && value != '1')
            throw new Error("Wrong digital value");

        return value == '1';
    });

    var telemetry = new Telemetry(id, analogValues, digitalValues);

    if (comment) {
        telemetry.setComment(comment.trim());
    }

    return telemetry;
};

TelemetryParser.prototype.getParserName = function () {
    return "TelemetryParser";
};

module.exports = TelemetryParser;