'use strict';

var chai = require('chai');
var expect = chai.expect;

var TelemetryDescriptionParser = require("../lib/Telemetry/TelemetryDescriptionParser");

var TelemetryNames = require("../lib/Telemetry/TelemetryNames.js");
var TelemetryLabels = require("../lib/Telemetry/TelemetryLabels.js");
var TelemetryEquations = require("../lib/Telemetry/TelemetryEquations.js");
var TelemetryBitSense = require("../lib/Telemetry/TelemetryBitSense.js");

describe('Telemetry description', function () {
    it('Names (not all fields described)', function () {
        var content = ":N0QBF-11 :PARM.Battery,Btemp,ATemp,Pres,Alt,Camra";
        var parser = new TelemetryDescriptionParser();

        expect(parser.isMatching(content)).to.equal(true);

        var parsed = parser.tryParse(content);

        expect(parsed).to.be.an.instanceOf(TelemetryNames);
        expect(parsed.call).to.eql("N0QBF-11");
        expect(parsed.desc).to.eql(["Battery", "Btemp", "ATemp", "Pres", "Alt", "Camra"]);
    });

    it('Names (too many fields)', function () {
        var content = ":N0QBF-11 :PARM.Battery,Btemp,ATemp,Pres,Alt,Camra,Chut,Sun,10m,ATV,Test,Test,Test,Test";
        var parser = new TelemetryDescriptionParser();

        expect(parser.isMatching(content)).to.equal(true);

        expect(function () {
            parser.tryParse(content);
        }).to.throw(Error);
    });

    it('Unit/Labels', function () {
        var content = ":N0QBF-11 :UNIT.v/100,deg.F,deg.F,Mbar,Kft,Click,OPEN,on,on,hi";
        var parser = new TelemetryDescriptionParser();

        expect(parser.isMatching(content)).to.equal(true);

        var parsed = parser.tryParse(content);

        expect(parsed).to.be.an.instanceOf(TelemetryLabels);
        expect(parsed.call).to.eql("N0QBF-11");
        expect(parsed.labels).to.eql(["v/100", "deg.F", "deg.F", "Mbar", "Kft", "Click", "OPEN", "on", "on", "hi"]);
    });

    it('Coeff', function () {
        var content = ":N0QBF-11 :EQNS.0,5.2,0,0,.53,-32,3,4.39,49,-32,3,18,1,2,3";
        var parser = new TelemetryDescriptionParser();

        expect(parser.isMatching(content)).to.equal(true);

        var parsed = parser.tryParse(content);

        expect(parsed).to.be.an.instanceOf(TelemetryEquations);
        expect(parsed.call).to.eql("N0QBF-11");
        expect(parsed.coeff).to.eql([[0, 5.2, 0], [0, 0.53, -32], [3, 4.39, 49], [-32, 3, 18], [1, 2, 3]]);
    });

    it('Coeff (not valid number of coefficients)', function () {
        var content = ":N0QBF-11 :EQNS.0,5.2,0,0,.53,-32,3,4.39,49,-32,3,18,1,2,3,5";
        var parser = new TelemetryDescriptionParser();

        expect(parser.isMatching(content)).to.equal(true);

        expect(function () {
            parser.tryParse(content)
        }).to.throw(Error);
    });

    it('Bit sense', function () {
        var content = ":N0QBF-11 :BITS.10110000,N0QBF’s Big Balloon";
        var parser = new TelemetryDescriptionParser();
        expect(parser.isMatching(content)).to.equal(true);

        var parsed = parser.tryParse(content);

        expect(parsed).to.be.an.instanceOf(TelemetryBitSense);
        expect(parsed.call).to.eql("N0QBF-11");
        expect(parsed.sense).to.eql([true, false, true, true, false, false, false, false]);
        expect(parsed.projectName).to.eql("N0QBF’s Big Balloon");
    });
});