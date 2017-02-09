'use strict';

var chai = require('chai');
var expect = chai.expect;

var TelemetryDescriptionParser = require("../lib/Telemetry/TelemetryDescriptionParser");
var TelemetryDescription = require("../lib/Telemetry/TelemetryDescription.js");

describe('Telemetry description', function () {
    it('Descriptions (not all fields described)', function () {
        var content = ":N0QBF-11 :PARM.Battery,Btemp,ATemp,Pres,Alt,Camra";
        var parser = new TelemetryDescriptionParser();

        expect(parser.isMatching(content)).to.equal(true);

        var parsed = parser.tryParse(content);

        expect(parsed).to.be.an.instanceOf(TelemetryDescription);
        expect(parsed.call).to.eql("N0QBF-11");
        expect(parsed.desc).to.eql(["Battery", "Btemp", "ATemp", "Pres", "Alt", "Camra"]);
    });

    it('Descriptions (too many fields)', function () {
        var content = ":N0QBF-11 :PARM.Battery,Btemp,ATemp,Pres,Alt,Camra,Chut,Sun,10m,ATV,Test,Test,Test,Test";
        var parser = new TelemetryDescriptionParser();

        expect(parser.isMatching(content)).to.equal(true);

        expect(function () {
            parser.tryParse(content);
        }).to.throw(Error);
    });
});