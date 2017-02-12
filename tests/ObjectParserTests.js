'use strict';

var chai = require('chai');
var expect = chai.expect;

var Models = require("../lib/MessageModels");
var ObjectParser = require("../lib/Object/ObjectParser");

describe('Object position parser', function () {
    it('Name, symbol and position', function () {
        var msg = ";LEADER   *092345z4903.50N/07201.75W>";
        var parser = new ObjectParser();

        var parsed = parser.tryParse(msg);

        expect(parsed).to.be.instanceOf(Models.ObjectPosition);
        expect(parsed.name).to.be.eql("LEADER");
        expect(parsed.timestamp).to.be.eql("092345z");
        expect(parsed.symbol).to.be.eql("/>");
        expect(parsed.latitude).to.be.eql(49 + 3.50 / 60);
        expect(parsed.longitude).to.be.eql(-1 * (72 + 1.75 / 60));
        expect(parsed.status).to.be.eql(Models.ObjectPosition.Status.LIVE);
        expect(parsed.comment).to.not.exist;
    });

    it('Altitude and comment', function () {
        var msg = ";LEADER   *092345z4903.50N/07201.75W>/A=001000Hello world";
        var parser = new ObjectParser();

        var parsed = parser.tryParse(msg);

        expect(parsed).to.be.instanceOf(Models.ObjectPosition);
        expect(parsed.comment).to.be.eql("Hello world");
        expect(parsed.altitude).to.be.eql(304.8);
    });
});