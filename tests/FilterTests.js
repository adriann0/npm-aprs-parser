'use strict';

const chai = require('chai');
const expect = chai.expect;
const Filter = require('../lib/Filter.js');

describe('Filter', () => {
    it('Empty filter', () => {
        const filter = new Filter();
        expect(filter.toString()).to.equal('');
    });
    it('Range (km)', () => {
        const filter = new Filter();
        filter.range(42, -117, 100);
        expect(filter.toString()).to.equal('filter r/42/-117/100');
    });
    it('Range (mi)', () => {
        const filter = new Filter();
        filter.range(-42, 117, 100, 'mi');
        expect(filter.toString()).to.equal('filter r/-42/117/160.9344');
    });
    it('Multiple included ranges', () => {
        const filter = new Filter();
        filter.range(35, -10, 50, 'km');
        filter.range(-42, 117, 100, 'mi');
        expect(filter.toString()).to.equal('filter r/35/-10/50 r/-42/117/160.9344');
    });
    it('Multiple excluded ranges', () => {
        const filter = new Filter();
        filter.range(35, -10, 50, 'km', false);
        filter.range(-42, 117, 100, 'mi', false);
        expect(filter.toString()).to.equal('filter -r/35/-10/50 -r/-42/117/160.9344');
    });
    it('Include and exclude ranges', () => {
        const filter = new Filter();
        filter.range(35, -10, 50, 'km');
        filter.range(-42, 117, 100, 'mi', false);
        expect(filter.toString()).to.equal('filter r/35/-10/50 -r/-42/117/160.9344');
    });
    it('Include Prefix', () => {
        const filter = new Filter();
        filter.prefix('KI7');
        expect(filter.toString()).to.equal('filter p/KI7');
    });
    it('Include Multiple Prefix', () => {
        const filter = new Filter();
        filter.prefix('K');
        filter.prefix('W');
        expect(filter.toString()).to.equal('filter p/K/W');
    });
    it('Exclude Prefix', () => {
        const filter = new Filter();
        filter.prefix('KI7', false);
        expect(filter.toString()).to.equal('filter -p/KI7');
    });
    it('Exclude Multiple Prefix', () => {
        const filter = new Filter();
        filter.prefix('KI', false);
        filter.prefix('W1', false);
        expect(filter.toString()).to.equal('filter -p/KI/W1');
    });
    it('Include Budlist', () => {
        const filter = new Filter();
        filter.budlist('KI7RAU-12');
        expect(filter.toString()).to.equal('filter b/KI7RAU-12');
    });
    it('Budlist with wildcard', () => {
        const filter = new Filter();
        filter.budlist('KI7RAU*');
        expect(filter.toString()).to.equal('filter b/KI7RAU*');
    });
    it('Include & Exclude Budlist', () => {
        const filter = new Filter();
        filter.budlist('KI7RAU*');
        filter.budlist('KI7RAU-5', false);
        expect(filter.toString()).to.equal('filter b/KI7RAU* -b/KI7RAU-5');
    });
    it('Include Object', () => {
        const filter = new Filter();
        filter.object('hamWANcap');
        expect(filter.toString()).to.equal('filter o/hamWANcap');
    });
    it('Object needing sanitizing', () => {
        const filter = new Filter();
        filter.object('obj/ect*1');
        expect(filter.toString()).to.equal('filter o/obj|ect~1');
    });
    it('Strict Object should be at the end', () => {
        const filter = new Filter();
        filter.strictObject('hamWANcap');
        filter.range(42, -117, 100);
        expect(filter.toString()).to.equal('filter r/42/-117/100 os/hamWANcap');
    });
    it('Only one strict object', () => {
        const filter = new Filter();
        filter.strictObject('hamWANcap');
        filter.strictObject('objectnam', false);
        expect(filter.toString()).to.equal('filter os/hamWANcap');
    });
    it('Types', () => {
        const filter = new Filter();
        filter.type('nw');
        filter.type('oi');
        expect(filter.toString()).to.equal('filter t/nwoi');
    });
    it('Types plus type with distance', () => {
        const filter = new Filter();
        filter.type('oi');
        filter.typeWithDistance('w', 'KI7RAU-12', 100);
        expect(filter.toString()).to.equal('filter t/oi t/w/KI7RAU-12/100');
    });
    it('Primary Symbol', () => {
        const filter = new Filter();
        filter.symbol('->');
        expect(filter.toString()).to.equal('filter s/->//'); //Technically from the example filter, this shouldn't have trailing slashes, but rotate.aprs2.net accepts it with slashes
    });
    it('Alternate Symbol', () => {
        const filter = new Filter();
        filter.symbol('', '#');
        expect(filter.toString()).to.equal('filter s//#/');
    });
    it('Symbol Overlay', () => {
        const filter = new Filter();
        filter.symbol('', '#', 'T');
        expect(filter.toString()).to.equal('filter s//#/T');
    });
    it('Digipeater', () => {
        const filter = new Filter();
        filter.digipeater('TIGER');
        expect(filter.toString()).to.equal('filter d/TIGER');
    });
    it('Area', () => {
        const filter = new Filter();
        filter.area(45.5, -124, 47.5, -121);
        expect(filter.toString()).to.equal('filter a/45.5/-124/47.5/-121');
    });
    it('Entry Station (exclude)', () => {
        const filter = new Filter();
        filter.entryStation('IG7ATE-1', false);
        expect(filter.toString()).to.equal('filter -e/IG7ATE-1');
    });
    it('Group', () => {
        const filter = new Filter();
        filter.group('KI7RAU*');
        expect(filter.toString()).to.equal('filter g/KI7RAU*');
    });
    it('Unpronto/To', () => {
        const filter = new Filter();
        filter.unpronto('KI7RAU*');
        expect(filter.toString()).to.equal('filter u/KI7RAU*');
    });
    it('Q Construct, qAC', () => {
        const filter = new Filter();
        filter.qConstruct('C');
        expect(filter.toString()).to.equal('filter q/C');
    });
    it('Q Construct, qAr or qAR', () => {
        const filter = new Filter();
        filter.qConstruct('rR');
        expect(filter.toString()).to.equal('filter q/rR');
    });
    it('Q Construct, IGATES', () => {
        const filter = new Filter();
        filter.qConstruct('', true);
        expect(filter.toString()).to.equal('filter q//I');
    });
    it('My Range', () => {
        const filter = new Filter();
        filter.myRange(100, 'mi');
        expect(filter.toString()).to.equal('filter m/160.9344');
    });
    it('My Range updates instead of appending if set again', () => {
        const filter = new Filter();
        filter.myRange(100, 'mi');
        filter.myRange(100);
        expect(filter.toString()).to.equal('filter m/100');
    });
    it('Friend Range', () => {
        const filter = new Filter();
        filter.friendRange('W1ADV', 200, 'km');
        expect(filter.toString()).to.equal('filter f/W1ADV/200');
    });
    it('Combined filter test #1', () => {
        const filter = new Filter();
        filter.range(33, -97, 200); //Get traffic near Dallas
        filter.type('n'); //Plus NWS bulletins
        expect(filter.toString()).to.equal('filter r/33/-97/200 t/n');
    });
    it('Combined filter test #2', () => {
        const filter = new Filter();
        filter.myRange(200); //All stations within 200km of me
        filter.prefix('CW', false); //Except with prefix CW
        expect(filter.toString()).to.equal('filter -p/CW m/200');
    });
});