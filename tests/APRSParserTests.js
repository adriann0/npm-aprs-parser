'use strict';

var chai = require('chai');
var expect = chai.expect;

var Models = require("../lib/MessageModels");

var APRSMessage = require("../lib/APRSMessage.js");

var Callsign = require("../lib/Callsign.js");

var APRSParser = require("../lib/index.js");

describe('APRSParser', function () {
    var parser = new APRSParser.APRSParser();

    it('Header parsing', function () {
        var obj = parser.parse("SQ7PFS-15>APRS,TCPIP:");
        expect(obj).to.be.an.instanceOf(APRSMessage);

        expect(obj).to.exist;
        expect(obj.from).to.eql(new Callsign("SQ7PFS-15"));
        expect(obj.to).to.eql(new Callsign("APRS"));
        expect(obj.via).to.eql([new Callsign("TCPIP")]);
    });

    it('Not compressed position recognition', function () {
        var obj = parser.parse("SQ7PFS>APRS:!5214.93ND02106.32E&");

        expect(obj).to.exist;
        expect(obj.data).to.exist;
        expect(obj.data).to.be.an.instanceOf(Models.Position);
    });

    it('Message recognition', function () {
        var obj = parser.parse("SQ7PFS>APRS::WU2Z     :Testing{003 ");

        expect(obj).to.exist;
        expect(obj.data).to.exist;
        expect(obj.data).to.be.an.instanceOf(Models.Message);
    });

    it('Telemetry recognition', function () {
        var obj = parser.parse("SQ7PFS>APRS:T#005,199,000,255,073,123,01101001");

        expect(obj).to.exist;
        expect(obj.data).to.exist;
        expect(obj.data).to.be.an.instanceOf(Models.Telemetry);
    });

    it('Telemetry names recognition', function () {
        var obj = parser.parse("SQ7PFS>APRS::N0QBF-11 :PARM.Battery,Btemp,ATemp,Pres,Alt,Camra");

        expect(obj).to.exist;
        expect(obj.data).to.exist;
        expect(obj.data).to.be.an.instanceOf(Models.TelemetryNames);
    });

    it('Telemetry labels/units recognition', function () {
        var obj = parser.parse("SQ7PFS>APRS::N0QBF-11 :UNIT.v/100,deg.F,deg.F,Mbar,Kft,Click,OPEN,on,on,hi");

        expect(obj).to.exist;
        expect(obj.data).to.exist;
        expect(obj.data).to.be.an.instanceOf(Models.TelemetryLabels);
    });

    it('Telemetry coefficients recognition', function () {
        var obj = parser.parse("SQ7PFS>APRS::N0QBF-11 :EQNS.0,5.2,0,0,.53,-32,3,4.39,49,-32,3,18,1,2,3");

        expect(obj).to.exist;
        expect(obj.data).to.exist;
        expect(obj.data).to.be.an.instanceOf(Models.TelemetryEquations);
    });

    it('Telemetry bit sense recognition', function () {
        var obj = parser.parse("SQ7PFS>APRS::N0QBF-11 :BITS.10110000,N0QBF’s Big Balloon");

        expect(obj).to.exist;
        expect(obj.data).to.exist;
        expect(obj.data).to.be.an.instanceOf(Models.TelemetryBitSense);
    });

    it('Unknown format recognition', function () {
        var obj = parser.parse("SQ7PFS>APRS:Z");

        expect(obj).to.exist;
        expect(obj).to.be.an.instanceOf(APRSMessage);
        expect(obj.data).to.not.exist;
    });
});