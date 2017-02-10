'use strict';

var chai = require('chai');
var expect = chai.expect;

var Message = require("../lib/MessageModels/Message.js");
var Position = require("../lib/MessageModels/Position.js");
var Telemetry = require("../lib/MessageModels/Telemetry.js");
var TelemetryNames = require("../lib/MessageModels/TelemetryNames.js");

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
        expect(obj.data).to.be.an.instanceOf(Position);
    });

    it('Message recognition', function () {
        var obj = parser.parse("SQ7PFS>APRS::WU2Z     :Testing{003 ");

        expect(obj).to.exist;
        expect(obj.data).to.exist;
        expect(obj.data).to.be.an.instanceOf(Message);
    });

    it('Telemetry recognition', function () {
        var obj = parser.parse("SQ7PFS>APRS:T#005,199,000,255,073,123,01101001");

        expect(obj).to.exist;
        expect(obj.data).to.exist;
        expect(obj.data).to.be.an.instanceOf(Telemetry);
    });

    it('Telemetry description recognition', function () {
        var obj = parser.parse("SQ7PFS>APRS::N0QBF-11 :PARM.Battery,Btemp,ATemp,Pres,Alt,Camra");

        expect(obj).to.exist;
        expect(obj.data).to.exist;
        expect(obj.data).to.be.an.instanceOf(TelemetryNames);
    });

    it('Unknown format recognition', function () {
        var obj = parser.parse("SQ7PFS>APRS:Z");

        expect(obj).to.exist;
        expect(obj).to.be.an.instanceOf(APRSMessage);
        expect(obj.data).to.not.exist;
    });
});