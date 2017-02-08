'use strict';

var chai = require('chai');
var expect = chai.expect;
var Callsign = require("../lib/Callsign.js");

describe('Callsing', function () {
    it('Constructor should split into call and SSID', function () {
        var callsign = new Callsign("SQ7PFS-15");
        expect(callsign.call).to.equal("SQ7PFS");
        expect(callsign.ssid).to.equal("15");
    });

    it('Callsing without SSID', function () {
        var callsign = new Callsign("SQ7PFS");
        expect(callsign.call).to.equal("SQ7PFS");
        expect(callsign.ssid).to.not.exist;
    });
});