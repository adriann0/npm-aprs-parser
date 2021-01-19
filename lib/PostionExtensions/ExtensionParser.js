'use strict';

const AbstractParser = require('../AbstractParser.js');
const ExtensionsModels = require('./ExtensionModels');

const PositionParserUtils = require('../Position/UncompressedPositionParserUtil');

function ExtensionParser() {

}

const isCourseSpeed = function (bodyContent) {
    return bodyContent.match('^[0-3][0-9]{2,2}');
};

const parseCourseSpeed = function (bodyContent) {
    const course = parseInt(bodyContent.substr(0, 3));
    const speed = parseInt(bodyContent.substr(4, 3)); //knots

    return new ExtensionsModels.CourseSpeed(course, PositionParserUtils.knotsToMetersPerSecond(speed));
};

const isPHG = function (bodyContent) {
    return bodyContent.match('^PHG[0-9]{3,3}[0-8]');
};

const parsePHG = function (bodyContent) {
    const ret = new ExtensionsModels.PHG();
    ret.setPowerCode(parseInt(bodyContent[3]));
    ret.setHeightCode(parseInt(bodyContent[4]));
    ret.setGainCode(parseInt(bodyContent[5]));
    ret.setDirectivityCode(parseInt(bodyContent[6]));
    return ret;
};

const isDFS = function (bodyContent) {
    return bodyContent.match('^DFS[0-9]{3,3}[0-8]');
};

const parseDFS = function (bodyContent) {
    const ret = new ExtensionsModels.DFS();
    ret.setStrengthCode(parseInt(bodyContent[3]));
    ret.setHeightCode(parseInt(bodyContent[4]));
    ret.setGainCode(parseInt(bodyContent[5]));
    ret.setDirectivityCode(parseInt(bodyContent[6]));
    return ret;
};

const isRNG = function (bodyContent) {
    return bodyContent.match('^RNG[0-9]{4}');
};


const parseRNG = function (bodyContent) {
    return new ExtensionsModels.RNG(PositionParserUtils.milesToMeters(parseInt(bodyContent.substr(3))));
};

ExtensionParser.constructor = ExtensionParser;
ExtensionParser.prototype = Object.create(AbstractParser.prototype);

ExtensionParser.prototype.isMatching = function (bodyContent) {
    return isCourseSpeed(bodyContent) || isDFS(bodyContent) || isPHG(bodyContent) || isRNG(bodyContent);
};

ExtensionParser.prototype.tryParse = function (bodyContent, aprsMessageHeader) {
    if(isCourseSpeed(bodyContent)) {
        return parseCourseSpeed(bodyContent);
    }
    else if(isPHG(bodyContent)) {
        return parsePHG(bodyContent);
    }
    else if(isDFS(bodyContent)) {
        return parseDFS(bodyContent);
    }
    else if(isRNG(bodyContent)) {
        return parseRNG(bodyContent);
    }
};

ExtensionParser.prototype.getParserName = function () {
    return 'ExtensionParser';
};

module.exports = ExtensionParser;