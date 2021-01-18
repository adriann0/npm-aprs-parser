'use strict';

const chai = require('chai');
const expect = chai.expect;

const Models = require('../lib/MessageModels');
const PositionParser = require('../lib/Position/PositionParser.js');

describe('Position parser', () => {
    it('Minimal frame (not compressed)', () => {
        const content = '!4903.50N/07201.75W-';
        const parser = new PositionParser();

        expect(parser.isMatching(content.substr(0, 1))).to.equal(true);

        const parsed = parser.tryParse(content);

        expect(parsed).to.be.instanceOf(Models.Position);
        expect(parsed.msgEnabled).to.be.eql(false);

        const latitude = 49 + (3.50 / 60);
        const longitude = -1 * (72 + (1.75 / 60));

        expect(parsed.latitude).to.be.eql(latitude);
        expect(parsed.longitude).to.be.eql(longitude);
        expect(parsed.symbol).to.be.eql('/-');
    });

    it('Comment with altitude', () => {
        const content = '!4903.50N/07201.75W-Hello/A=001000';
        const parser = new PositionParser();

        const parsed = parser.tryParse(content);

        expect(parsed).to.be.instanceOf(Models.Position);
        expect(parsed.comment).to.be.eql('Hello');
        expect(parsed.altitude).to.be.eql(304.8);
    });

    it('Compressed latitude / longitude', () => {
        const content = '!/5L!!<*e7>7P[';
        const parser = new PositionParser();

        expect(parser.isMatching(content.substr(0, 1))).to.equal(true);

        const parsed = parser.tryParse(content);

        expect(parsed).to.be.instanceOf(Models.Position);

        const epsilon = 0.0001;
        const expectedLatitude = 49.5;
        const expectedLongitude = -72.75;

        expect(parsed.latitude).to.be.within(expectedLatitude - epsilon, expectedLatitude + epsilon);
        expect(parsed.longitude).to.be.within(expectedLongitude - epsilon, expectedLongitude + epsilon);
        expect(parsed.symbol).to.be.eql('/>');
    });

});