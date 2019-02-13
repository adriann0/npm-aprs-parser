'use strict';
var AbstractParser = require("../AbstractParser.js");
var MICEPosition = require("./../MessageModels/MICEPosition");

var Utils = require("./MICEParserUtils.js");

function MICEParser() {

}


MICEParser.constructor = MICEParser;
MICEParser.prototype = Object.create(AbstractParser.prototype);

MICEParser.prototype.isMatching = function (bodyContent) {
    var first = bodyContent[0];
    return (first == "`" || first == "'");
};

MICEParser.prototype.tryParse = function (bodyContent, aprsMessageHeader) {
    if (bodyContent.length < 9)
        throw new Error("Too short body for MIC-E (length < 9)");

    var fromDestinationAddress = Utils.readDataFromDestinationAddress(aprsMessageHeader.to.call);

    var longitude = Utils.parseLogitudeFormat(bodyContent.substr(1, 3), fromDestinationAddress.logitudeOffset, fromDestinationAddress.isWest);

    //order in MIC-E is symbol code then symbol table
    var symbol = bodyContent[8] + bodyContent[7];
    var comment = bodyContent.substr(9);

    var position = new MICEPosition(fromDestinationAddress.latitude, longitude);
    position.setMICEState(fromDestinationAddress.miceState);
    position.setSymbol(symbol);
    position.setExtension(Utils.parseCourseAndSpeed(bodyContent.substr(4, 3)));
    
    if (comment) {
        comment = position.setRadio(comment);
        position.setComment(comment);

        //altitude from mice overwrite altitude parsed from comment
        comment = position.getAltitudeFromMICE(comment);

        //Check for and parse base91 telemetry (if present)
        comment = position.getBase91TelemFromMICE(comment);
    }
    return position;
};

MICEParser.prototype.getParserName = function () {
    return "MICEParser";
};

module.exports = MICEParser;
