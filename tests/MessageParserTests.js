'use strict';

const chai = require('chai');
const expect = chai.expect;

const MessageParser = require('../lib/Message/MessageParser');
const Message = require('../lib/MessageModels/Message.js');

describe('Messages', () => {
    it('Parsing addressee and content', () => {
        const content = ':WU2Z     :Testing';
        const parser = new MessageParser();

        expect(parser.isMatching(content.substr(0, 1))).to.equal(true);

        const result = parser.tryParse(content);
        expect(result.text).to.equal('Testing');
        expect(result.addressee.call).to.equal('WU2Z');
        expect(result.type).to.equal('msg');
        expect(result.id).to.not.exist;
    });

    it('Parsing addressee, content and id', () => {
        const content = ':WU2Z     :Testing{003';
        const parser = new MessageParser();

        expect(parser.isMatching(content.substr(0, 1))).to.equal(true);

        const result = parser.tryParse(content);
        expect(result.text).to.equal('Testing');
        expect(result.addressee.call).to.equal('WU2Z');
        expect(result.id).to.equal(3);
        expect(result.type).to.equal('msg');
    });

    it('Parsing ACK message', () => {
        const content = ':KB2ICI   :ack003';
        const parser = new MessageParser();

        expect(parser.isMatching(content.substr(0, 1))).to.equal(true);

        const result = parser.tryParse(content);
        expect(result.id).to.equal(3);
        expect(result.addressee.call).to.equal('KB2ICI');
        expect(result.type).to.equal('ack');
    });

    it('Parsing REJ message', () => {
        const content = ':KB2ICI-14:rej003';
        const parser = new MessageParser();

        expect(parser.isMatching(content.substr(0, 1))).to.equal(true);

        const result = parser.tryParse(content);
        expect(result.id).to.equal(3);
        expect(result.addressee.call).to.equal('KB2ICI');
        expect(result.addressee.ssid).to.equal('14');
        expect(result.type).to.equal('rej');
    });
});