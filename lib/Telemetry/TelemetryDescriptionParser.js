'use strict';
var AbstractParser = require("../AbstractParser.js");
var MessageParser = require("../Message/MessageParser");

var TelemetryNames = require("./../MessageModels/TelemetryNames.js");
var TelemetryLabels = require("./../MessageModels/TelemetryLabels.js");
var TelemetryEquations = require("./../MessageModels/TelemetryEquations.js");
var TelemetryBitSense = require("./../MessageModels/TelemetryBitSense.js");

function TelemetryDescriptionParser() {
}

TelemetryDescriptionParser.constructor = TelemetryDescriptionParser;
TelemetryDescriptionParser.prototype = Object.create(AbstractParser.prototype);

TelemetryDescriptionParser.prototype.isMatching = function (bodyContent) {
    return !!bodyContent.match("^:.{9,9}:PARM.") || !!bodyContent.match("^:.{9,9}:UNIT.") || !!bodyContent.match("^:.{9,9}:EQNS.") || !!bodyContent.match("^:.{9,9}:BITS.");
};

var parseParm = function (addressee, descriptions) {
    if (descriptions.length > 13)
        throw new Error("Too many description fields");

    return new TelemetryNames(addressee, descriptions);
};

var parseUnit = function (addressee, descriptions) {
    if (descriptions.length > 13)
        throw new Error("Too many unit fields");

    return new TelemetryLabels(addressee, descriptions);
};

var parseEqns = function (addressee, descriptions) {
    var coeff = [];

    var i, j;
    var temparray;
    var chunk = 3;

    for (i = 0, j = descriptions.length; i < j; i += chunk) {
        temparray = descriptions.slice(i, i + chunk);

        if (temparray.length != 3) {
            throw new Error("Wrong EQNS format (chunks.length != 3)");
        }

        coeff.push(temparray.map(parseFloat));
    }

    return new TelemetryEquations(addressee, coeff);
};

var parseBits = function (addressee, descriptions) {
    if (descriptions.length != 2) {
        throw new Error("In BITS more than 2 elements after splitting by ,");
    }

    if (descriptions[0].length != 8) {
        throw new Error("More than 8 bits in BITS?");
    }

    var bits = descriptions[0].split("").map(function (input) {
        if (input == "1")
            return true;
        else if (input == "0")
            return false;
        else
            throw new Error("Wrong bit value in BITS");
    });

    return new TelemetryBitSense(addressee, bits, descriptions[1]);
};


TelemetryDescriptionParser.prototype.tryParse = function (bodyContent) {
    var messageParser = new MessageParser();
    var message = messageParser.tryParse(bodyContent);

    var addressee = message.addressee.toString();
    var descriptions = message.text.substr(5).split(",");

    if (message.text[0] == "P") {
        //PARM
        return parseParm(addressee, descriptions);
    }
    else if (message.text[0] == "U") {
        //UNIT
        return parseUnit(addressee, descriptions);
    }
    else if (message.text[0] == "E") {
        //EQNS
        return parseEqns(addressee, descriptions);
    }
    else if (message.text[0] == "B") {
        //BITS
        return parseBits(addressee, descriptions);
    }

};

module.exports = TelemetryDescriptionParser;