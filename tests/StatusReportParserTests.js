'use strict';

var chai = require('chai');
var expect = chai.expect;

var Models = require("../lib/MessageModels");
var StatusReportParser = require("../lib/StatusReport/StatusReportParser");

describe('StatusReportParser', function () {
    it('Beam heading parsing', function () {
        var obj = new Models.StatusReport();

        obj.setBeamHeading("Z");
        expect(obj.beamHeadingDeg).to.be.eql(350);

        obj.setBeamHeading("A");
        expect(obj.beamHeadingDeg).to.be.eql(100);

        obj.setBeamHeading("0");
        expect(obj.beamHeadingDeg).to.be.eql(0);

        obj.setBeamHeading("9");
        expect(obj.beamHeadingDeg).to.be.eql(90);
    });

    it('ERP parsing', function () {
        var obj = new Models.StatusReport();

        obj.setERP("1");
        expect(obj.erp).to.be.eql(10);

        obj.setERP(":");
        expect(obj.erp).to.be.eql(1000);

        obj.setERP("K");
        expect(obj.erp).to.be.eql(7290);

        expect(function () {
            obj.setERP("L");
        }).to.throw(Error);
    });

    it('With maidenhead grid locator', function () {
        var parser = new StatusReportParser();
        var parsed = parser.tryParse(">IO91SX/- My house");

        expect(parsed).to.be.instanceOf(Models.StatusReport);
        expect(parsed.statusText).to.be.eql("My house");
        expect(parsed.symbol).to.be.eql("/-");
        expect(parsed.locator).to.be.eql("IO91SX");
    });

    it('With timestamp', function () {
        var parser = new StatusReportParser();
        var parsed = parser.tryParse(">092345zNet Control Center");

        expect(parsed).to.be.instanceOf(Models.StatusReport);
        expect(parsed.statusText).to.be.eql("Net Control Center");

        var now = new Date();
        now.setUTCDate(9);
        now.setUTCHours(23, 45, 0, 0);
        expect(parsed.timestamp).to.be.eql(now);
    });

    it('With ERP and beam heading', function () {
        var parser = new StatusReportParser();
        var parsed = parser.tryParse(">IO91SX/- Hello^B7");

        expect(parsed).to.be.instanceOf(Models.StatusReport);
        expect(parsed.statusText).to.be.eql("Hello");
        expect(parsed.symbol).to.be.eql("/-");
        expect(parsed.erp).to.be.eql(490);
        expect(parsed.beamHeadingDeg).to.be.eql(110);
    });

    it('Regular status report', function () {
        var parser = new StatusReportParser();
        var parsed = parser.tryParse(">Hello world");

        expect(parsed).to.be.instanceOf(Models.StatusReport);
        expect(parsed.statusText).to.be.eql("Hello world");
    });
});