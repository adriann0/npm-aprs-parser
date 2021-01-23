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

    it('Comment with weather', () => {
        const content = '!4237.15N/00625.38W_261/002g005t049r000p000P000h47b10224myWeather';
        const parser = new PositionParser();
        const parsed = parser.tryParse(content);
        expect(parsed).to.be.instanceOf(Models.Position);
        expect(parsed.comment).to.be.eql('myWeather');
        expect(parsed.weather).to.not.be.null;
        expect(parsed.weather.humidity).to.be.eql(47);
    });

    it('Comment with course/speed extension and weather', () => {
        const content = '@231821z5150.13N/01913.68E_239/003g010t042r000p011P011b09969h83L000eMB51';
        const parser = new PositionParser();
        const parsed = parser.tryParse(content);

        const epsilon = 0.0001;
        const expectedSpeed = 1.543333332;

        expect(parsed.extension.courseDeg).to.be.eql(239);
        expect(parsed.extension.speedMPerS).to.be.within(expectedSpeed - epsilon, expectedSpeed + epsilon);
        expect(parsed.weather.pressure).to.be.eql(996.9);
        expect(parsed.comment).to.be.eql("eMB51");
    })

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