'use strict';
const AbstractParser = require('../AbstractParser.js');
const MessageParser = require('../Message/MessageParser');

const TelemetryNames = require('./../MessageModels/TelemetryNames.js');
const TelemetryLabels = require('./../MessageModels/TelemetryLabels.js');
const TelemetryEquations = require('./../MessageModels/TelemetryEquations.js');
const TelemetryBitSense = require('./../MessageModels/TelemetryBitSense.js');

function TelemetryDescriptionParser() {
}

TelemetryDescriptionParser.constructor = TelemetryDescriptionParser;
TelemetryDescriptionParser.prototype = Object.create(AbstractParser.prototype);

TelemetryDescriptionParser.prototype.isMatching = function (bodyContent) {
    return !!bodyContent.match('^:.{9,9}:PARM.') || !!bodyContent.match('^:.{9,9}:UNIT.') || !!bodyContent.match('^:.{9,9}:EQNS.') || !!bodyContent.match('^:.{9,9}:BITS.');
};

const parseParm = function (addressee, descriptions) {
    if (descriptions.length > 13)
        throw new Error('Too many description fields');

    return new TelemetryNames(addressee, descriptions);
};

const parseUnit = function (addressee, descriptions) {
    if (descriptions.length > 13)
        throw new Error('Too many unit fields');

    return new TelemetryLabels(addressee, descriptions);
};

const parseEqns = function (addressee, descriptions) {
    const coeff = [];

    let i, j;
    let temparray;
    const chunk = 3;

    for (i = 0, j = descriptions.length; i < j; i += chunk) {
        temparray = descriptions.slice(i, i + chunk);

        if (temparray.length != 3) {
            throw new Error('Wrong EQNS format (chunks.length != 3)');
        }

        coeff.push(temparray.map(parseFloat));
    }

    return new TelemetryEquations(addressee, coeff);
};

const parseBits = function (addressee, descriptions) {
    if (descriptions.length != 2) {
        throw new Error('In BITS more than 2 elements after splitting by ,');
    }

    if (descriptions[0].length != 8) {
        throw new Error('More than 8 bits in BITS?');
    }

    const bits = descriptions[0].split('').map((input) => {
        if (input == '1')
            return true;
        else if (input == '0')
            return false;
        else
            throw new Error('Wrong bit value in BITS');
    });

    return new TelemetryBitSense(addressee, bits, descriptions[1]);
};


TelemetryDescriptionParser.prototype.tryParse = function (bodyContent, aprsMessageHeader) {
    const messageParser = new MessageParser();
    const message = messageParser.tryParse(bodyContent);

    const addressee = message.addressee.toString();
    const descriptions = message.text.substr(5).split(',');

    if (message.text[0] == 'P') {
        //PARM
        return parseParm(addressee, descriptions);
    }
    else if (message.text[0] == 'U') {
        //UNIT
        return parseUnit(addressee, descriptions);
    }
    else if (message.text[0] == 'E') {
        //EQNS
        return parseEqns(addressee, descriptions);
    }
    else if (message.text[0] == 'B') {
        //BITS
        return parseBits(addressee, descriptions);
    }

};

TelemetryDescriptionParser.prototype.getParserName = function () {
    return 'TelemetryDescParser';
};

module.exports = TelemetryDescriptionParser;