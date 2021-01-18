'use strict';
const AbstractParser = require('../AbstractParser.js');

const Telemetry = require('./../MessageModels/Telemetry.js');

function TelemetryParser() {
}

TelemetryParser.constructor = TelemetryParser;
TelemetryParser.prototype = Object.create(AbstractParser.prototype);

TelemetryParser.prototype.isMatching = function (bodyContent) {
    return bodyContent[0] == 'T';
};

TelemetryParser.prototype.tryParse = function (bodyContent, aprsMessageHeader) {
    const commaSeparated = bodyContent.split(',');

    if (commaSeparated.length != 7 || !commaSeparated[0].match('T#[0-9]{3,3}')) {
        throw new Error('Wrong telemetry format');
    }

    const id = parseInt(commaSeparated[0].substr(2));

    const analogValues = commaSeparated.slice(1, 6).map((value) => {
        const numericValue = parseInt(value);
        if (!value.match('^[0-9]{3,3}$') || value > 255 || value < 0)
            throw new Error('Wrong analog value');

        return numericValue;
    });

    let digitalString = commaSeparated[6];

    let comment;
    if (digitalString.length > 8) {
        //have comment, remove it
        comment = digitalString.substr(8);
        digitalString = digitalString.substr(0, 8);
    }

    const digitalValues = digitalString.split('').map((value) => {
        if (value != '0' && value != '1')
            throw new Error('Wrong digital value');

        return value == '1';
    });

    const telemetry = new Telemetry(id, analogValues, digitalValues);

    if (comment) {
        telemetry.setComment(comment.trim());
    }

    return telemetry;
};

TelemetryParser.prototype.getParserName = function () {
    return 'TelemetryParser';
};

module.exports = TelemetryParser;