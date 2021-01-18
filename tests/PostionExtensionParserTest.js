'use strict';

const chai = require('chai');
const expect = chai.expect;

const Models = require('../lib/PostionExtensions/ExtensionModels');
const ExtensionParser = require('../lib/PostionExtensions/ExtensionParser.js');

const PositionParserUtils = require('../lib/Position/UncompressedPositionParserUtil');

describe('APRSParser', () => {
    const parser = new ExtensionParser();

    it('PHG', () => {
        const parsed = parser.tryParse('PHG5132');

        expect(parsed).to.be.an.instanceOf(Models.PHG);
        expect(parsed.powerWatts).to.eql(25);
        expect(parsed.heightFeet).to.eql(20);
        expect(parsed.gaindB).to.eql(3);
        expect(parsed.directivityDeg).to.eql(90); //0 = omni
    });

    it('DFS', () => {
        const parsed = parser.tryParse('DFS2360');

        expect(parsed).to.be.an.instanceOf(Models.DFS);
        expect(parsed.strengthS).to.eql(2);
        expect(parsed.heightFeet).to.eql(80);
        expect(parsed.gaindB).to.eql(6);
        expect(parsed.directivityDeg).to.eql(0); //0 = omni
    });

    it('RNG', () => {
        const parsed = parser.tryParse('RNG0050');

        expect(parsed).to.be.an.instanceOf(Models.RNG);
        expect(parsed.rangeMeters).to.eql(PositionParserUtils.milesToMeters(50));
    });

    it('Course / Speed', () => {
        const parsed = parser.tryParse('088/036');

        expect(parsed).to.be.an.instanceOf(Models.CourseSpeed);
        expect(parsed.courseDeg).to.eql(88);
        expect(parsed.speedMPerS).to.eql(PositionParserUtils.knotsToMetersPerSecond(36));
    });
});