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
    return first == "`";
};

MICEParser.prototype.tryParse = function (bodyContent, aprsMessageHeader) {
    if (bodyContent.length < 9)
        throw new Error("Too short body for MIC-E (length < 9)");

    var fromDestinationAddress = Utils.readDataFromDestinationAddress(aprsMessageHeader.to.call);

    var longitude = Utils.parseLogitudeFormat(bodyContent.substr(1, 3), fromDestinationAddress.logitudeOffset, fromDestinationAddress.isWest);

    var symbol = bodyContent[7] + bodyContent[8];
    var comment = bodyContent.substr(9);

    var position = new MICEPosition(fromDestinationAddress.latitude, longitude);
    position.setMICEState(fromDestinationAddress.miceState);
    position.setSymbol(symbol);

    if (comment)
        position.setComment(comment);

    return position;
};

module.exports = MICEParser;