'use strict';

var chai = require('chai');
var expect = chai.expect;

var Models = require("../lib/MessageModels");
var ObjectParser = require("../lib/Object/ObjectParser");

describe('Object position parser', function () {
    it('Name, symbol and position', function () {
        var msg = ";LEADER   *092345z4903.50N/07201.75W>";
        var parser = new ObjectParser();

        var parsed = parser.tryParse(msg);

        expect(parsed).to.be.instanceOf(Models.ObjectPosition);
        expect(parsed.name).to.be.eql("LEADER");

        var now = new Date();
        now.setUTCDate(9);
        now.setUTCHours(23, 45, 0, 0);
        expect(parsed.timestamp).to.be.eql(now);

        expect(parsed.symbol).to.be.eql("/>");
        expect(parsed.latitude).to.be.eql(49 + 3.50 / 60);
        expect(parsed.longitude).to.be.eql(-1 * (72 + 1.75 / 60));
        expect(parsed.status).to.be.eql(Models.ObjectPosition.Status.LIVE);
        expect(parsed.comment).to.not.exist;
    });

    it('Altitude within comment', function () {
        var msg = ";LEADER   *092345z4903.50N/07201.75W>/A=001000Hello world";
        var parser = new ObjectParser();

        var parsed = parser.tryParse(msg);

        expect(parsed).to.be.instanceOf(Models.ObjectPosition);
        expect(parsed.comment).to.be.eql("Hello world");
        expect(parsed.altitude).to.be.eql(304.8);
    });

    it('Name, symbol and position (compressed)', function () {
        var msg = ";LEADER   *092345z/5L!!<*e7>7P[Hello";
        var parser = new ObjectParser();

        var parsed = parser.tryParse(msg);

        expect(parsed).to.be.instanceOf(Models.ObjectPosition);
        expect(parsed.name).to.be.eql("LEADER");

        var now = new Date();
        now.setUTCDate(9);
        now.setUTCHours(23, 45, 0, 0);
        expect(parsed.timestamp).to.be.eql(now);

        expect(parsed.symbol).to.be.eql("/>");

        var epsilon = 0.0001;
        var expectedLatitude = 49.5;
        var expectedLongitude = -72.75;

        expect(parsed.latitude).to.be.within(expectedLatitude - epsilon, expectedLatitude + epsilon);
        expect(parsed.longitude).to.be.within(expectedLongitude - epsilon, expectedLongitude + epsilon);

        expect(parsed.status).to.be.eql(Models.ObjectPosition.Status.LIVE);
        expect(parsed.comment).to.be.eql("Hello");
    });
});