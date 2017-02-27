'use strict';

var chai = require('chai');
var expect = chai.expect;

var Models = require("../lib/PostionExtensions/ExtensionModels");
var ExtensionParser = require("../lib/PostionExtensions/ExtensionParser.js");

var PositionParserUtils = require("../lib/Position/UncompressedPositionParserUtil");

describe('APRSParser', function () {
    var parser = new ExtensionParser();

    it('PHG', function () {
        var parsed = parser.tryParse("PHG5132");

        expect(parsed).to.be.an.instanceOf(Models.PHG);
        expect(parsed.powerWatts).to.eql(25);
        expect(parsed.heightFeet).to.eql(20);
        expect(parsed.gaindB).to.eql(3);
        expect(parsed.directivityDeg).to.eql(90); //0 = omni
    });

    it('DFS', function () {
        var parsed = parser.tryParse("DFS2360");

        expect(parsed).to.be.an.instanceOf(Models.DFS);
        expect(parsed.strengthS).to.eql(2);
        expect(parsed.heightFeet).to.eql(80);
        expect(parsed.gaindB).to.eql(6);
        expect(parsed.directivityDeg).to.eql(0); //0 = omni
    });

    it('Course / Speed', function () {
        var parsed = parser.tryParse("088/036");

        expect(parsed).to.be.an.instanceOf(Models.CourseSpeed);
        expect(parsed.courseDeg).to.eql(88);
        expect(parsed.speedMPerS).to.eql(PositionParserUtils.knotsToMetersPerSecond(36));
    });
});