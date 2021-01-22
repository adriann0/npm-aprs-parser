'use strict';

const WeatherParserUtils = require('../lib/Position/WeatherParserUtils.js');

const chai = require('chai');
const expect = chai.expect;

describe('WeatherParserUtils', () => {
    it('Text regex & extract comment from weather', () => {
        const parsed = WeatherParserUtils.parseWeatherData('g002t017r000p000P000h80b10232L016_COMMENT_AFTER');
        expect(parsed.weather).to.exist;
        expect(parsed.comment).to.exist;
        expect(parsed.weather.pressure).to.exist;
        expect(parsed.weather.pressure).to.eql(1023.2);
        expect(parsed.weather.humidity).to.exist;
        expect(parsed.weather.humidity).to.eql(80);
        expect(parsed.weather.luminosity).to.exist;
        expect(parsed.weather.luminosity).to.eql(16);
        expect(parsed.weather.rain_1h).to.exist;
        expect(parsed.weather.rain_1h).to.eql(0);
        expect(parsed.weather.rain_24h).to.exist;
        expect(parsed.weather.rain_24h).to.eql(0);
        expect(parsed.weather.rain_since_midnight).to.exist;
        expect(parsed.weather.rain_since_midnight).to.eql(0);
        expect(parsed.weather.temperature).to.exist;
        expect(parsed.weather.temperature).to.eql((17-32)/1.8);
        expect(parsed.comment).to.eql('_COMMENT_AFTER');
    });


    it('Another weather string with rain', () => {
        const parsed = WeatherParserUtils.parseWeatherData('g000t036r012p041P041h90b09933eCumulusWS2300');
        expect(parsed.weather).to.exist;
        expect(parsed.comment).to.exist;
        expect(parsed.weather.pressure).to.exist;
        expect(parsed.weather.pressure).to.eql(993.3);
        expect(parsed.weather.humidity).to.exist;
        expect(parsed.weather.humidity).to.eql(90);
        expect(parsed.weather.rain_1h).to.exist;
        expect(parsed.weather.rain_1h).to.eql(3.048);
        expect(parsed.weather.rain_24h).to.exist;
        expect(parsed.weather.rain_24h).to.eql(10.414);
        expect(parsed.weather.rain_since_midnight).to.exist;
        expect(parsed.weather.rain_since_midnight).to.eql(10.414);
        expect(parsed.weather.temperature).to.exist;
        expect(parsed.weather.temperature).to.eql((36-32)/1.8);
        expect(parsed.comment).to.eql('eCumulusWS2300');
    });
});
