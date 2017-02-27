'use strict';

var AbstractParser = require("../AbstractParser.js");
var ExtensionsModels = require("./ExtensionModels");

var PositionParserUtils = require("../Position/UncompressedPositionParserUtil");

function ExtensionParser() {

}

var isCourseSpeed = function (bodyContent) {
    return bodyContent.match("^[0-3][0-9]{2,2}");
}

var parseCourseSpeed = function (bodyContent) {
    var course = parseInt(bodyContent.substr(0, 3));
    var speed = parseInt(bodyContent.substr(4, 3)); //knots

    return new ExtensionsModels.CourseSpeed(course, PositionParserUtils.knotsToMetersPerSecond(speed));
}

var isPHG = function (bodyContent) {
    return bodyContent.match("^PHG[0-9]{3,3}[0-8]");
}

var parsePHG = function (bodyContent) {
    var ret = new ExtensionsModels.PHG();
    ret.setPowerCode(parseInt(bodyContent[3]));
    ret.setHeightCode(parseInt(bodyContent[4]));
    ret.setGainCode(parseInt(bodyContent[5]));
    ret.setDirectivityCode(parseInt(bodyContent[6]));
    return ret;
}

var isDFS = function (bodyContent) {
    return bodyContent.match("^DFS[0-9]{3,3}[0-8]");
}

var parseDFS = function (bodyContent) {
    var ret = new ExtensionsModels.DFS();
    ret.setStrengthCode(parseInt(bodyContent[3]));
    ret.setHeightCode(parseInt(bodyContent[4]));
    ret.setGainCode(parseInt(bodyContent[5]));
    ret.setDirectivityCode(parseInt(bodyContent[6]));
    return ret;
}

ExtensionParser.constructor = ExtensionParser;
ExtensionParser.prototype = Object.create(AbstractParser.prototype);

ExtensionParser.prototype.isMatching = function (bodyContent) {
    return isCourseSpeed(bodyContent) || isDFS(bodyContent) || isPHG(bodyContent);
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
};

ExtensionParser.prototype.getParserName = function () {
    return "ExtensionParser";
};

module.exports = ExtensionParser;