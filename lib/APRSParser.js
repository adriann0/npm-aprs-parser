'use strict';

const APRSMessage = require('./APRSMessage.js');
const Callsign = require('./Callsign.js');

const PositionParser = require('./Position/PositionParser.js');
const MessageParser = require('./Message/MessageParser.js');
const TelemetryParser = require('./Telemetry/TelemetryParser.js');
const TelemetryDescriptionParser = require('./Telemetry/TelemetryDescriptionParser.js');
const MICEParser = require('./Position/MICEParser.js');
const ObjectParser = require('./Object/ObjectParser.js');
const StatusReportParser = require('./StatusReport/StatusReportParser.js');
const Base91TelemetryParser = require('./Telemetry/Base91TelemetryParser.js');

const parseHeader = function (messageHeaderString, messageObject) {
    const destinationDelimiterPos = messageHeaderString.indexOf('>');

    if (destinationDelimiterPos < 0) {
        throw new Error('Malformed header');
    }

    const fromCallsignString = messageHeaderString.substr(0, destinationDelimiterPos);

    const toAndDigiString = messageHeaderString.substr(destinationDelimiterPos + 1);
    const toAndDigiDelimiterPos = toAndDigiString.indexOf(',');

    let toCallsignString = '';
    let digiArray = [];

    if (toAndDigiDelimiterPos < 0) {
        toCallsignString = toAndDigiString;
        digiArray = [];
    }
    else {
        toCallsignString = toAndDigiString.substr(0, toAndDigiDelimiterPos);
        digiArray = toAndDigiString.substr(toAndDigiDelimiterPos + 1).split(',');
    }

    messageObject.setHeaderInfo(new Callsign(fromCallsignString), new Callsign(toCallsignString), digiArray.map((obj) => {
        return new Callsign(obj);
    }));

    return messageObject;
};

function APRSParser() {
    //order should by from the most general to the most specific (ex. telemetry description is also message - message parser should be first)
    this.parsers = [
        new PositionParser(),
        new MessageParser(),
        new TelemetryParser(),
        new TelemetryDescriptionParser(),
        new MICEParser(),
        new ObjectParser(),
        new StatusReportParser(),
        new Base91TelemetryParser()
    ];
}

APRSParser.prototype.parse = function (messageContent) {
    let aprsMessage = new APRSMessage();
    aprsMessage.setRawData(messageContent);
    const errors = [];

    try {
        const headerDelimiterPos = messageContent.indexOf(':');

        if (headerDelimiterPos < 0) {
            throw new Error('Header - body delimiter not found');
        }

        const messageBodyString = messageContent.substr(headerDelimiterPos + 1);
        const messageHeaderString = messageContent.substr(0, headerDelimiterPos);

        aprsMessage = parseHeader(messageHeaderString, aprsMessage);

        for (let i = 0; i < this.parsers.length; i++) {
            const parser = this.parsers[i];

            if (parser.isMatching(messageBodyString)) {
                try {
                    const data = parser.tryParse(messageBodyString, aprsMessage);

                    if (data) {
                        aprsMessage.setBody(data);
                    }
                }
                catch (ex) {
                    errors.push(parser.getParserName() + ': ' + ex.toString());
                }
            }
        }
    }
    catch (ex) {
        errors.push('General: ' + ex.toString());
    }

    if (!aprsMessage.data && errors.length != 0)
        aprsMessage.setErrors(errors);

    return aprsMessage;
};

module.exports = APRSParser;