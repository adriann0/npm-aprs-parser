'use strict';

var chai = require('chai');
var expect = chai.expect;

var Models = require("../lib/MessageModels");
var PositionParser = require("../lib/Position/PositionParser.js");

describe('Position parser', function () {
    it('Minimal frame (not compressed)', function () {
        var content = "!4903.50N/07201.75W-";
        var parser = new PositionParser();

        expect(parser.isMatching(content.substr(0, 1))).to.equal(true);

        var parsed = parser.tryParse(content);

        expect(parsed).to.be.instanceOf(Models.Position);
        expect(parsed.msgEnabled).to.be.eql(false);

        var latitude = 49 + (3.50 / 60);
        var longitude = -1 * (72 + (1.75 / 60));

        expect(parsed.latitude).to.be.eql(latitude);
        expect(parsed.longitude).to.be.eql(longitude);
        expect(parsed.symbol).to.be.eql("/-");
    });

    it('Comment with altitude', function () {
        var content = "!4903.50N/07201.75W-Hello/A=001000";
        var parser = new PositionParser();

        var parsed = parser.tryParse(content);

        expect(parsed).to.be.instanceOf(Models.Position);
        expect(parsed.comment).to.be.eql("Hello");
        expect(parsed.altitude).to.be.eql(304.8);
    });

    it('Comment with weather', function () {
        var content = "!4237.15N/00625.38W_261/002g005t049r000p000P000h47b10224myWeather";
        var parser = new PositionParser();
        var parsed = parser.tryParse(content);
        expect(parsed).to.be.instanceOf(Models.Position);
        expect(parsed.comment).to.be.eql("myWeather");
        expect(parsed.weather).to.not.be.null;
        expect(parsed.weather.humidity).to.be.eql(47)
    });

    it('Compressed latitude / longitude', function () {
        var content = "!/5L!!<*e7>7P[";
        var parser = new PositionParser();

        expect(parser.isMatching(content.substr(0, 1))).to.equal(true);

        var parsed = parser.tryParse(content);

        expect(parsed).to.be.instanceOf(Models.Position);

        var epsilon = 0.0001;
        var expectedLatitude = 49.5;
        var expectedLongitude = -72.75;

        expect(parsed.latitude).to.be.within(expectedLatitude - epsilon, expectedLatitude + epsilon);
        expect(parsed.longitude).to.be.within(expectedLongitude - epsilon, expectedLongitude + epsilon);
        expect(parsed.symbol).to.be.eql("/>");
    });

});