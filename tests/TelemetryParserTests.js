'use strict';

const chai = require('chai');
const expect = chai.expect;

const TelemetryParser = require('../lib/Telemetry/TelemetryParser.js');

describe('Telemetry', () => {
    it('Telemetry without comment', () => {
        const content = 'T#005,199,000,255,073,123,01101001';
        const parser = new TelemetryParser();

        expect(parser.isMatching(content.substr(0, 1))).to.equal(true);

        const parsed = parser.tryParse(content);

        expect(parsed.id).to.equal(5);
        expect(parsed.analog).to.eql([199, 0, 255, 73, 123]);
        expect(parsed.digital).to.eql([false, true, true, false, true, false, false, true]);
    });

    it('Telemetry with comment', () => {
        const content = 'T#005,199,000,255,073,123,01101001Hello';
        const parser = new TelemetryParser();

        expect(parser.isMatching(content.substr(0, 1))).to.equal(true);

        const parsed = parser.tryParse(content);

        expect(parsed.id).to.equal(5);
        expect(parsed.analog).to.eql([199, 0, 255, 73, 123]);
        expect(parsed.digital).to.eql([false, true, true, false, true, false, false, true]);
        expect(parsed.comment).to.equal('Hello');
    });

    it('Illegal analog value', () => {
        const content = 'T#005,256,000,255,073,123,01101001';
        const parser = new TelemetryParser();

        expect(parser.isMatching(content.substr(0, 1))).to.equal(true);

        expect(() => {
            parser.tryParse(content);
        }).to.throw(Error);
    });

    it('Illegal digital value', () => {
        const content = 'T#005,255,000,255,073,123,01201001';
        const parser = new TelemetryParser();

        expect(parser.isMatching(content.substr(0, 1))).to.equal(true);

        expect(() => {
            parser.tryParse(content);
        }).to.throw(Error);
    });
});