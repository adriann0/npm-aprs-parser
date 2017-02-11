'use strict';

var chai = require('chai');
var expect = chai.expect;

var Models = require("../lib/MessageModels");
var PositionParser = require("../lib/Position/PositionParser.js");

describe('Position parser', function () {
    it('Minimal frame', function () {
        var content = "!4903.50N/07201.75W-";
        var parser = new PositionParser();

        expect(parser.isMatching(content.substr(0, 1))).to.equal(true);

        var parsed = parser.tryParse(content);

        expect(parsed).to.be.instanceOf(Models.Position);
        expect(parsed.msgEnabled).to.be.eql(false);

        var latitude = 49 + (3 / 60) + (50 / 3600);
        var longitude = -1 * (72 + (1 / 60) + (75 / 3600));

        expect(parsed.latitude).to.be.eql(latitude);
        expect(parsed.longitude).to.be.eql(longitude);
        expect(parsed.symbol).to.be.eql("/-");
    });

    it('Comment with altitude', function () {
        var content = "!4903.50N/07201.75W-Hello/A=001000";
        var parser = new PositionParser();

        var parsed = parser.tryParse(content);

        expect(parsed).to.be.instanceOf(Models.Position);
        expect(parsed.comment).to.be.eql("Hello");
        expect(parsed.altitude).to.be.eql(304.8);
    });

});