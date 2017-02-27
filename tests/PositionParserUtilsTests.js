'use strict';

var PositionParserUtil = require("../lib/Position/PositionParserUtils.js");
var UncompressedPositionParserUtil = require("../lib/Position/UncompressedPositionParserUtil.js");

var chai = require('chai');
var expect = chai.expect;

describe('PositionParserUtil', function () {
    it('Zulu time and date (DHM)', function () {
        var now = new Date();
        now.setUTCDate(9);
        now.setUTCHours(23, 45, 0, 0);

        var parsed = PositionParserUtil.parseTimestamp("092345z");

        expect(parsed).to.be.eql(now);
    });

    it('Hours/Minutes/Seconds time format (HMS)', function () {
        var now = new Date();
        now.setUTCHours(23, 45, 17, 0);

        var parsed = PositionParserUtil.parseTimestamp("234517h");

        expect(parsed).to.be.eql(now);
    });

    it('Local time', function () {
        /*
         Local time should not be used anymore, parsing local time not implemented
         */

        expect(function () {
            PositionParserUtil.parseTimestamp("234517/");
        }).to.throw(Error);
    });

    it('Extension, altitude, comment split', function () {
        var parsed = UncompressedPositionParserUtil.parseAltitudeAndExtension("088/036Hello/A=001000");

        expect(parsed.comment).to.exist;
        expect(parsed.extension).to.exist;
        expect(parsed.altitude).to.exist;
        expect(parsed.comment).to.eql("Hello");
    });
});
