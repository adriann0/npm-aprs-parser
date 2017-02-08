'use strict';

var chai = require('chai');
var expect = chai.expect;

var TelemetryParser = require("../lib/Telemetry/TelemetryParser.js");

describe('Telemetry', function () {
    it('Telemetry without comment', function () {
        var content = "T#005,199,000,255,073,123,01101001";
        var parser = new TelemetryParser();

        expect(parser.isMatching(content.substr(0, 1))).to.equal(true);

        var parsed = parser.tryParse(content);

        expect(parsed.id).to.equal(5);
        expect(parsed.analog).to.eql([199, 0, 255, 73, 123]);
        expect(parsed.digital).to.eql([false, true, true, false, true, false, false, true]);
    });

    it('Telemetry with comment', function () {
        var content = "T#005,199,000,255,073,123,01101001Hello";
        var parser = new TelemetryParser();

        expect(parser.isMatching(content.substr(0, 1))).to.equal(true);

        var parsed = parser.tryParse(content);

        expect(parsed.id).to.equal(5);
        expect(parsed.analog).to.eql([199, 0, 255, 73, 123]);
        expect(parsed.digital).to.eql([false, true, true, false, true, false, false, true]);
        expect(parsed.comment).to.equal("Hello");
    });

    it('Illegal analog value', function () {
        var content = "T#005,256,000,255,073,123,01101001";
        var parser = new TelemetryParser();

        expect(parser.isMatching(content.substr(0, 1))).to.equal(true);

        expect(function () {
            parser.tryParse(content);
        }).to.throw(Error);
    });

    it('Illegal digital value', function () {
        var content = "T#005,255,000,255,073,123,01201001";
        var parser = new TelemetryParser();

        expect(parser.isMatching(content.substr(0, 1))).to.equal(true);

        expect(function () {
            parser.tryParse(content);
        }).to.throw(Error);
    });
});