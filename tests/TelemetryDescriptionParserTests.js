'use strict';

const chai = require('chai');
const expect = chai.expect;

const TelemetryDescriptionParser = require('../lib/Telemetry/TelemetryDescriptionParser');

const TelemetryNames = require('../lib/MessageModels/TelemetryNames.js');
const TelemetryLabels = require('../lib/MessageModels/TelemetryLabels.js');
const TelemetryEquations = require('../lib/MessageModels/TelemetryEquations.js');
const TelemetryBitSense = require('../lib/MessageModels/TelemetryBitSense.js');

describe('Telemetry description', () => {
    it('Names (not all fields described)', () => {
        const content = ':N0QBF-11 :PARM.Battery,Btemp,ATemp,Pres,Alt,Camra';
        const parser = new TelemetryDescriptionParser();

        expect(parser.isMatching(content)).to.equal(true);

        const parsed = parser.tryParse(content);

        expect(parsed).to.be.an.instanceOf(TelemetryNames);
        expect(parsed.call).to.eql('N0QBF-11');
        expect(parsed.desc).to.eql(['Battery', 'Btemp', 'ATemp', 'Pres', 'Alt', 'Camra']);
    });

    it('Names (too many fields)', () => {
        const content = ':N0QBF-11 :PARM.Battery,Btemp,ATemp,Pres,Alt,Camra,Chut,Sun,10m,ATV,Test,Test,Test,Test';
        const parser = new TelemetryDescriptionParser();

        expect(parser.isMatching(content)).to.equal(true);

        expect(() => {
            parser.tryParse(content);
        }).to.throw(Error);
    });

    it('Unit/Labels', () => {
        const content = ':N0QBF-11 :UNIT.v/100,deg.F,deg.F,Mbar,Kft,Click,OPEN,on,on,hi';
        const parser = new TelemetryDescriptionParser();

        expect(parser.isMatching(content)).to.equal(true);

        const parsed = parser.tryParse(content);

        expect(parsed).to.be.an.instanceOf(TelemetryLabels);
        expect(parsed.call).to.eql('N0QBF-11');
        expect(parsed.labels).to.eql(['v/100', 'deg.F', 'deg.F', 'Mbar', 'Kft', 'Click', 'OPEN', 'on', 'on', 'hi']);
    });

    it('Coeff', () => {
        const content = ':N0QBF-11 :EQNS.0,5.2,0,0,.53,-32,3,4.39,49,-32,3,18,1,2,3';
        const parser = new TelemetryDescriptionParser();

        expect(parser.isMatching(content)).to.equal(true);

        const parsed = parser.tryParse(content);

        expect(parsed).to.be.an.instanceOf(TelemetryEquations);
        expect(parsed.call).to.eql('N0QBF-11');
        expect(parsed.coeff).to.eql([[0, 5.2, 0], [0, 0.53, -32], [3, 4.39, 49], [-32, 3, 18], [1, 2, 3]]);
    });

    it('Coeff (not valid number of coefficients)', () => {
        const content = ':N0QBF-11 :EQNS.0,5.2,0,0,.53,-32,3,4.39,49,-32,3,18,1,2,3,5';
        const parser = new TelemetryDescriptionParser();

        expect(parser.isMatching(content)).to.equal(true);

        expect(() => {
            parser.tryParse(content);
        }).to.throw(Error);
    });

    it('Bit sense', () => {
        const content = ':N0QBF-11 :BITS.10110000,N0QBF’s Big Balloon';
        const parser = new TelemetryDescriptionParser();
        expect(parser.isMatching(content)).to.equal(true);

        const parsed = parser.tryParse(content);

        expect(parsed).to.be.an.instanceOf(TelemetryBitSense);
        expect(parsed.call).to.eql('N0QBF-11');
        expect(parsed.sense).to.eql([true, false, true, true, false, false, false, false]);
        expect(parsed.projectName).to.eql('N0QBF’s Big Balloon');
    });
});