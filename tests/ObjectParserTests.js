'use strict';

const chai = require('chai');
const expect = chai.expect;

const Models = require('../lib/MessageModels');
const ObjectParser = require('../lib/Object/ObjectParser');

describe('Object position parser', () => {
    it('Name, symbol and position', () => {
        const msg = ';LEADER   *092345z4903.50N/07201.75W>';
        const parser = new ObjectParser();

        const parsed = parser.tryParse(msg);

        expect(parsed).to.be.instanceOf(Models.ObjectPosition);
        expect(parsed.name).to.be.eql('LEADER');

        const now = new Date();
        now.setUTCDate(9);
        now.setUTCHours(23, 45, 0, 0);
        expect(parsed.timestamp).to.be.eql(now);

        expect(parsed.symbol).to.be.eql('/>');
        expect(parsed.latitude).to.be.eql(49 + 3.50 / 60);
        expect(parsed.longitude).to.be.eql(-1 * (72 + 1.75 / 60));
        expect(parsed.status).to.be.eql(Models.ObjectPosition.Status.LIVE);
        expect(parsed.comment).to.not.exist;
    });

    it('Altitude within comment', () => {
        const msg = ';LEADER   *092345z4903.50N/07201.75W>/A=001000Hello world';
        const parser = new ObjectParser();

        const parsed = parser.tryParse(msg);

        expect(parsed).to.be.instanceOf(Models.ObjectPosition);
        expect(parsed.comment).to.be.eql('Hello world');
        expect(parsed.altitude).to.be.eql(304.8);
    });

    it('Name, symbol and position (compressed)', () => {
        const msg = ';LEADER   *092345z/5L!!<*e7>7P[Hello';
        const parser = new ObjectParser();

        const parsed = parser.tryParse(msg);

        expect(parsed).to.be.instanceOf(Models.ObjectPosition);
        expect(parsed.name).to.be.eql('LEADER');

        const now = new Date();
        now.setUTCDate(9);
        now.setUTCHours(23, 45, 0, 0);
        expect(parsed.timestamp).to.be.eql(now);

        expect(parsed.symbol).to.be.eql('/>');

        const epsilon = 0.0001;
        const expectedLatitude = 49.5;
        const expectedLongitude = -72.75;

        expect(parsed.latitude).to.be.within(expectedLatitude - epsilon, expectedLatitude + epsilon);
        expect(parsed.longitude).to.be.within(expectedLongitude - epsilon, expectedLongitude + epsilon);

        expect(parsed.status).to.be.eql(Models.ObjectPosition.Status.LIVE);
        expect(parsed.comment).to.be.eql('Hello');
    });
});