'use strict';

const chai = require('chai');
const expect = chai.expect;
const Callsign = require('../lib/Callsign.js');

describe('Callsing', () => {
    it('Constructor should split into call and SSID', () => {
        const callsign = new Callsign('SQ7PFS-15');
        expect(callsign.call).to.equal('SQ7PFS');
        expect(callsign.ssid).to.equal('15');
    });

    it('Callsing without SSID', () => {
        const callsign = new Callsign('SQ7PFS');
        expect(callsign.call).to.equal('SQ7PFS');
        expect(callsign.ssid).to.not.exist;
    });
});