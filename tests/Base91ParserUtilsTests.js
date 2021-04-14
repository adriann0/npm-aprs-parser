'use strict';

const Base91ParserUtils = require('../lib/Position/Base91ParserUtils.js');

const chai = require('chai');
const expect = chai.expect;

describe('Base91ParserUtils', () => {
    it('Two analog elements, DAO, and MIC-E type code', () => {
        const parsed = Base91ParserUtils.parseBase91Telemetry('|!9\'X$u|!wr8!|3');
        expect(parsed.telemetry).to.exist;
        expect(parsed.comment).to.exist;
        expect(parsed.telemetry.id).to.exist;
        expect(parsed.telemetry.id).to.eql(24);
        expect(parsed.telemetry.analog).to.exist;
        expect(parsed.telemetry.analog).to.eql([601, 357]);
        expect(parsed.telemetry.digital).to.exist;
        expect(parsed.telemetry.digital).to.eql([]);
        expect(parsed.comment).to.eql('!wr8!|3'); //Type code would get caught elsewhere in the parser chain. Doesn't show up in the final object if we parse the whole packet, but is present if we just parse the comment field
    });

    it('Three analog elements and a comment', () => {
        const parsed = Base91ParserUtils.parseBase91Telemetry('http://aprs.fi/|"p%T\'.ag|');
        expect(parsed.telemetry).to.exist;
        expect(parsed.comment).to.exist;
        expect(parsed.telemetry.id).to.exist;
        expect(parsed.telemetry.id).to.eql(170);
        expect(parsed.telemetry.analog).to.exist;
        expect(parsed.telemetry.analog).to.eql([415, 559, 5894]);
        expect(parsed.telemetry.digital).to.exist;
        expect(parsed.telemetry.digital).to.eql([]);
        expect(parsed.comment).to.eql('http://aprs.fi/');
    });

    it('Four analog elements and a comment', () => {
        const parsed = Base91ParserUtils.parseBase91Telemetry('Siilinjarvi|"p%T\'.agff|');
        expect(parsed.telemetry).to.exist;
        expect(parsed.comment).to.exist;
        expect(parsed.telemetry.id).to.exist;
        expect(parsed.telemetry.id).to.eql(170);
        expect(parsed.telemetry.analog).to.exist;
        expect(parsed.telemetry.analog).to.eql([415, 559, 5894, 6348]);
        expect(parsed.telemetry.digital).to.exist;
        expect(parsed.telemetry.digital).to.eql([]);
        expect(parsed.comment).to.eql('Siilinjarvi');
    });

    it('Four analog elements, no comment', () => {
        const parsed = Base91ParserUtils.parseBase91Telemetry('|"p%T\'.agff|');
        expect(parsed.telemetry).to.exist;
        expect(parsed.comment).to.exist;
        expect(parsed.telemetry.id).to.exist;
        expect(parsed.telemetry.id).to.eql(170);
        expect(parsed.telemetry.analog).to.exist;
        expect(parsed.telemetry.analog).to.eql([415, 559, 5894, 6348]);
        expect(parsed.telemetry.digital).to.exist;
        expect(parsed.telemetry.digital).to.eql([]);
        expect(parsed.comment).to.eql('');
    });

    it('Five analog elements and eight digital elements, no comment', () => {
        const parsed = Base91ParserUtils.parseBase91Telemetry('|ss1122334455!"|');
        expect(parsed.telemetry).to.exist;
        expect(parsed.comment).to.exist;
        expect(parsed.telemetry.id).to.exist;
        expect(parsed.telemetry.id).to.eql(7544);
        expect(parsed.telemetry.analog).to.exist;
        expect(parsed.telemetry.analog).to.eql([1472, 1564, 1656, 1748, 1840]);
        expect(parsed.telemetry.digital).to.exist;
        expect(parsed.telemetry.digital).to.eql([1, 0, 0, 0, 0, 0, 0, 0]);
        expect(parsed.comment).to.eql('');
    });

    it('Five analog elements and eight digital elements, with comment', () => {
        const parsed = Base91ParserUtils.parseBase91Telemetry('comment|ss1122334455!{|');
        expect(parsed.telemetry).to.exist;
        expect(parsed.comment).to.exist;
        expect(parsed.telemetry.id).to.exist;
        expect(parsed.telemetry.id).to.eql(7544);
        expect(parsed.telemetry.analog).to.exist;
        expect(parsed.telemetry.analog).to.eql([1472, 1564, 1656, 1748, 1840]);
        expect(parsed.telemetry.digital).to.exist;
        expect(parsed.telemetry.digital).to.eql([0, 1, 0, 1, 1, 0, 1, 0]);
        expect(parsed.comment).to.eql('comment');
    });

    it('Digital element using more than 8 bits', () => {
        const parsed = Base91ParserUtils.parseBase91Telemetry('comment|ss11223344zzzz|morecomment');
        expect(parsed.telemetry).to.exist;
        expect(parsed.comment).to.exist;
        expect(parsed.telemetry.id).to.exist;
        expect(parsed.telemetry.id).to.eql(7544);
        expect(parsed.telemetry.analog).to.exist;
        expect(parsed.telemetry.analog).to.eql([1472, 1564, 1656, 1748, 8188]);
        expect(parsed.telemetry.digital).to.exist;
        expect(parsed.telemetry.digital).to.eql([0, 0, 1, 1, 1, 1, 1, 1]);
        expect(parsed.comment).to.eql('commentmorecomment');
    });

    it('Invalid character', () => {
        const parsed = Base91ParserUtils.parseBase91Telemetry('|ss112~334455!"|');
        expect(parsed).to.not.exist;
    });

    it('Odd length', () => {
        const parsed = Base91ParserUtils.parseBase91Telemetry('|ss112334455!"|');
        expect(parsed).to.not.exist;
    });

    it('Too many elements', () => {
        const parsed = Base91ParserUtils.parseBase91Telemetry('|ss112233445566!"|');
        expect(parsed).to.not.exist;
    });
});