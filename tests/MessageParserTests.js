'use strict';

var chai = require('chai');
var expect = chai.expect;

var MessageParser = require("../lib/Message/MessageParser");
var Message = require("../lib/MessageModels/Message.js");

describe('Messages', function () {
    it('Parsing addressee and content', function () {
        var content = ":WU2Z     :Testing";
        var parser = new MessageParser();

        expect(parser.isMatching(content.substr(0, 1))).to.equal(true);

        var result = parser.tryParse(content);
        expect(result.text).to.equal("Testing");
        expect(result.addressee.call).to.equal("WU2Z");
        expect(result.type).to.equal("msg");
        expect(result.id).to.not.exist;
    });

    it('Parsing addressee, content and id', function () {
        var content = ":WU2Z     :Testing{003";
        var parser = new MessageParser();

        expect(parser.isMatching(content.substr(0, 1))).to.equal(true);

        var result = parser.tryParse(content);
        expect(result.text).to.equal("Testing");
        expect(result.addressee.call).to.equal("WU2Z");
        expect(result.id).to.equal(3);
        expect(result.type).to.equal("msg");
    });

    it('Parsing ACK message', function () {
        var content = ":KB2ICI   :ack003";
        var parser = new MessageParser();

        expect(parser.isMatching(content.substr(0, 1))).to.equal(true);

        var result = parser.tryParse(content);
        expect(result.id).to.equal(3);
        expect(result.addressee.call).to.equal("KB2ICI");
        expect(result.type).to.equal("ack");
    });

    it('Parsing REJ message', function () {
        var content = ":KB2ICI-14:rej003";
        var parser = new MessageParser();

        expect(parser.isMatching(content.substr(0, 1))).to.equal(true);

        var result = parser.tryParse(content);
        expect(result.id).to.equal(3);
        expect(result.addressee.call).to.equal("KB2ICI");
        expect(result.addressee.ssid).to.equal("14");
        expect(result.type).to.equal("rej");
    });
});