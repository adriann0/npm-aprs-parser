'use strict';

var PositionParserUtil = require("../lib/Position/PositionParserUtils.js");

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
});
