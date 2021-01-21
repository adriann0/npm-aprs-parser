'use strict';

const WeatherParserUtils = require('../lib/Position/WeatherParserUtils.js');

const chai = require('chai');
const expect = chai.expect;

describe('WeatherParserUtils', () => {
    it('Text regex & extract comment from weather', () => {
        const parsed = WeatherParserUtils.parseWeatherData('COMMENT_BEFORE_g002t017r000p000P000h80b10232L016_COMMENT_AFTER');
        expect(parsed.weather).to.exist;
        expect(parsed.comment).to.exist;
        expect(parsed.weather.pressure).to.exist;
        expect(parsed.weather.pressure).to.eql(1023.2);
        expect(parsed.comment).to.eql('COMMENT_BEFORE__COMMENT_AFTER');
    });
});
