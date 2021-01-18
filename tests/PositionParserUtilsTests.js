'use strict';

const PositionParserUtil = require('../lib/Position/PositionParserUtils.js');
const UncompressedPositionParserUtil = require('../lib/Position/UncompressedPositionParserUtil.js');

const chai = require('chai');
const expect = chai.expect;

describe('PositionParserUtil', () => {
    it('Zulu time and date (DHM)', () => {
        const now = new Date();
        now.setUTCDate(9);
        now.setUTCHours(23, 45, 0, 0);

        const parsed = PositionParserUtil.parseTimestamp('092345z');

        expect(parsed).to.be.eql(now);
    });

    it('Hours/Minutes/Seconds time format (HMS)', () => {
        const now = new Date();
        now.setUTCHours(23, 45, 17, 0);

        const parsed = PositionParserUtil.parseTimestamp('234517h');

        expect(parsed).to.be.eql(now);
    });

    it('Local time', () => {
        /*
         Local time should not be used anymore, parsing local time not implemented
         */

        expect(() => {
            PositionParserUtil.parseTimestamp('234517/');
        }).to.throw(Error);
    });

    it('Extension, altitude, comment split', () => {
        const parsed = UncompressedPositionParserUtil.parseAltitudeAndExtension('088/036Hello/A=001000');

        expect(parsed.comment).to.exist;
        expect(parsed.extension).to.exist;
        expect(parsed.altitude).to.exist;
        expect(parsed.comment).to.eql('Hello');
    });
});
