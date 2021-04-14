'use strict';

const chai = require('chai');
const expect = chai.expect;

const Models = require('../lib/MessageModels');
const MICEParser = require('../lib/Position/MICEParser.js');
const MICEParserUtils = require('../lib/Position/MICEParserUtils.js');
const Callsign = require('../lib/Callsign');
const App = require('../lib');

const CourseSpeed = require('../lib/PostionExtensions/ExtensionModels').CourseSpeed;
const UncompressedPositionParserUtil = require('../lib/Position/UncompressedPositionParserUtil');

describe('MIC-E position parser', () => {
    it('Parsing position longitude', () => {
        const parser = new MICEParser();
        const header = new App.APRSMessage(new Callsign('SQ7PFS'), new Callsign('S32U6T'), []);

        const parsed = parser.tryParse('`(_f "Oj/', header);

        expect(parsed).to.be.instanceOf(Models.MICEPosition);
        expect(parsed.longitude).to.be.eql(-1 * (12 + 7.74 / 60));
    });

    it('Parsing symbol', () => {
        const parser = new MICEParser();
        const header = new App.APRSMessage(new Callsign('SQ7PFS'), new Callsign('S32U6T'), []);

        const parsed = parser.tryParse('`(_f "Oj/', header);

        expect(parsed).to.be.instanceOf(Models.MICEPosition);
        expect(parsed.symbol).to.be.eql('/j');
    });

    it('Too short', () => {
        const parser = new MICEParser();
        const header = new App.APRSMessage(new Callsign('SQ7PFS'), new Callsign('S32U6T'), []);

        expect(() => {
            parser.tryParse('`(_f "Oj', header);
        }).to.throw(Error);
    });

    it('MIC-E Altitude', () => {
        const parser = new MICEParser();
        const header = new App.APRSMessage(new Callsign('SQ7PFS'), new Callsign('S32U6T'), []);

        const parsed = parser.tryParse('`(_f "Oj/"4T}', header);
        expect(parsed.altitude).to.be.eql(61);
    });

    it('MIC-E speed / course', () => {
        const parser = new MICEParser();
        const header = new App.APRSMessage(new Callsign('SQ7PFS'), new Callsign('S32U6T'), []);

        const parsed = parser.tryParse('`(_fn"Oj/', header);

        const extension = parsed.extension;
        expect(extension).to.be.an.instanceOf(CourseSpeed);
        expect(extension.courseDeg).to.be.eql(251);
        expect(extension.speedMPerS).to.be.eql(UncompressedPositionParserUtil.knotsToMetersPerSecond(20));
    });

    it('Radio model', () => {
        const parser = new MICEParser();
        const header = new App.APRSMessage(new Callsign('SQ7PFS'), new Callsign('S32U6T'), []);

        const parsed = parser.tryParse('`(_f "Oj/>abcdv', header);
        expect(parsed.radio).to.be.eql('Kenwood TH-D7A Mobile');
        expect(parsed.comment).to.be.eql('abcd');
    });

    it('MIC-E Base91 telemetry', () => {
        const parser = new MICEParser();
        const header = new App.APRSMessage(new Callsign('SQ7PFS'), new Callsign('S32U6T'), []);

        const parsed = parser.tryParse('`(_f "Oj/>|\'s%0\'c|', header);
        expect(parsed.telemetry.id).to.be.eql(628);
        expect(parsed.telemetry.analog).to.be.eql([379, 612]);
    });

});

describe('MIC-E position parser utils', () => {
    it('Extracting info from destination address', () => {
        //example from APRS documentation
        const info = MICEParserUtils.readDataFromDestinationAddress('S32U6T');

        expect(info.latitude).to.be.eql(33 + 25.64 / 60);
        expect(info.miceState).to.be.eql(Models.MICEPosition.State.M3);
        expect(info.logitudeOffset).to.be.eql(0);
        expect(info.isWest).to.be.eql(true);
    });

    it('Parsing longitude', () => {
        //example from APRS documentation
        const info = MICEParserUtils.parseLogitudeFormat('(_f', 100, true);

        expect(info).to.be.eql(-1 * (112 + 7.74 / 60));
    });

    it('Not printable characters', () => {
        //0x7F - DEL - 99 deg
        const str = String.fromCharCode(0x7F) + '_f';

        const info = MICEParserUtils.parseLogitudeFormat(str, 0, false);

        expect(info).to.be.eql(99 + 7.74 / 60);
    });

    it('MIC-E state', () => {
        //0, 0, 1 custom
        const info = MICEParserUtils.getStateFromMessage([0, 0, 1]);

        expect(info).to.be.eql(Models.MICEPosition.State.C6);
    });
});