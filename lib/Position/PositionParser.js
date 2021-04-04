'use strict';

const AbstractParser = require('../AbstractParser.js');
const PositionParserUtils = require('./PositionParserUtils.js');


function PositionParser() {

}

PositionParser.constructor = PositionParser;
PositionParser.prototype = Object.create(AbstractParser.prototype);

PositionParser.prototype.isMatching = function (bodyContent) {
    const first = bodyContent[0];
    return first == '!' || first == '=' || first == '/' || first == '@';
};

PositionParser.prototype.tryParse = function (bodyContent, aprsMessageHeader) {
    const messagingEnabled = bodyContent[0] == '=' || bodyContent[0] == '@';
    let timestamp;
    let contentWithoutTimestamp = bodyContent;

    //remove distinguisher char and/or timestamp
    if (bodyContent[0] == '@' || bodyContent[0] == '/') {
        //with timestamp
        timestamp = PositionParserUtils.parseTimestamp(bodyContent.substr(1, 7));
        contentWithoutTimestamp = bodyContent.substr(8);
    } else {
        contentWithoutTimestamp = bodyContent.substr(1);
    }

    const positionObject = PositionParserUtils.parsePositionAndCommentString(contentWithoutTimestamp);

    if (timestamp) {
        positionObject.setTimestamp(timestamp);
    }

    positionObject.setMessagingEnabled(messagingEnabled);

    return positionObject;
};

PositionParser.prototype.getParserName = function () {
    return 'PositionParser';
};

module.exports = PositionParser;