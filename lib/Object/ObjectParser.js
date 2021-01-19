'use strict';
const AbstractParser = require('../AbstractParser.js');
const ObjectPosition = require('../MessageModels/ObjectPosition.js');

const PositionParserUtil = require('../Position/PositionParserUtils.js');

function ObjectParser() {

}

ObjectParser.constructor = ObjectParser;
ObjectParser.prototype = Object.create(AbstractParser.prototype);

ObjectParser.prototype.isMatching = function (bodyContent) {
    const first = bodyContent[0];
    return first == ';';
};

ObjectParser.prototype.tryParse = function (bodyContent, aprsMessageHeader) {
    const name = bodyContent.substr(1, 9).trim();
    let status;

    if (bodyContent[10] == '*')
        status = ObjectPosition.Status.LIVE;
    else if (bodyContent[10] == '_')
        status = ObjectPosition.Status.KILLED;
    else
        throw new Error('Wrong status symbol: ' + bodyContent[10]);

    const timestamp = PositionParserUtil.parseTimestamp(bodyContent.substr(11, 7));

    const dataWithoutTimestampString = bodyContent.substr(18);

    const objectPos = new ObjectPosition(name, status, 0.0, 0.0);
    Object.assign(objectPos, PositionParserUtil.parsePositionAndCommentString(dataWithoutTimestampString));

    objectPos.setTimestamp(timestamp);

    return objectPos;
};

ObjectParser.prototype.getParserName = function () {
    return 'ObjectParser';
};

module.exports = ObjectParser;