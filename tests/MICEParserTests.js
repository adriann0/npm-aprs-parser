'use strict';

var chai = require('chai');
var expect = chai.expect;

var Models = require("../lib/MessageModels");
var MICEParser = require("../lib/Position/MICEParser.js");
var MICEParserUtils = require("../lib/Position/MICEParserUtils.js");
var Callsign = require("../lib/Callsign");
var App = require("../lib");

var CourseSpeed = require("../lib/PostionExtensions/ExtensionModels").CourseSpeed;
var UncompressedPositionParserUtil = require("../lib/Position/UncompressedPositionParserUtil");

describe('MIC-E position parser', function () {
    it('Parsing position longitude', function () {
        var parser = new MICEParser();
        var header = new App.APRSMessage(new Callsign("SQ7PFS"), new Callsign("S32U6T"), []);

        var parsed = parser.tryParse("`(_f \"Oj/", header);

        expect(parsed).to.be.instanceOf(Models.MICEPosition);
        expect(parsed.longitude).to.be.eql(-1 * (12 + 7.74 / 60));
    });

    it('Parsing symbol', function () {
        var parser = new MICEParser();
        var header = new App.APRSMessage(new Callsign("SQ7PFS"), new Callsign("S32U6T"), []);

        var parsed = parser.tryParse("`(_f \"Oj/", header);

        expect(parsed).to.be.instanceOf(Models.MICEPosition);
        expect(parsed.symbol).to.be.eql("/j");
    });

    it('Too short', function () {
        var parser = new MICEParser();
        var header = new App.APRSMessage(new Callsign("SQ7PFS"), new Callsign("S32U6T"), []);

        expect(function () {
            parser.tryParse("`(_f \"Oj", header)
        }).to.throw(Error);
    });

    it('MIC-E Altitude', function () {
        var parser = new MICEParser();
        var header = new App.APRSMessage(new Callsign("SQ7PFS"), new Callsign("S32U6T"), []);

        var parsed = parser.tryParse("`(_f \"Oj/\"4T}", header);
        expect(parsed.altitude).to.be.eql(61);
    });

    it('MIC-E speed / course', function () {
        var parser = new MICEParser();
        var header = new App.APRSMessage(new Callsign("SQ7PFS"), new Callsign("S32U6T"), []);

        var parsed = parser.tryParse("`(_fn\"Oj/", header);

        var extension = parsed.extension;
        expect(extension).to.be.an.instanceOf(CourseSpeed);
        expect(extension.courseDeg).to.be.eql(251);
        expect(extension.speedMPerS).to.be.eql(UncompressedPositionParserUtil.knotsToMetersPerSecond(20));
    });

    it('Radio model', function () {
        var parser = new MICEParser();
        var header = new App.APRSMessage(new Callsign("SQ7PFS"), new Callsign("S32U6T"), []);

        var parsed = parser.tryParse("`(_f \"Oj/>abcdv", header);
        expect(parsed.radio).to.be.eql("Kenwood TH-D7A Mobile");
        expect(parsed.comment).to.be.eql("abcd");
    });

});

describe('MIC-E position parser utils', function () {
    it('Extracting info from destination address', function () {
        //example from APRS documentation
        var info = MICEParserUtils.readDataFromDestinationAddress("S32U6T");

        expect(info.latitude).to.be.eql(33 + 25.64 / 60);
        expect(info.miceState).to.be.eql(Models.MICEPosition.State.M3);
        expect(info.logitudeOffset).to.be.eql(0);
        expect(info.isWest).to.be.eql(true);
    });

    it('Parsing longitude', function () {
        //example from APRS documentation
        var info = MICEParserUtils.parseLogitudeFormat("(_f", 100, true);

        expect(info).to.be.eql(-1 * (112 + 7.74 / 60));
    });

    it('Not printable characters', function () {
        //0x7F - DEL - 99 deg
        var str = String.fromCharCode(0x7F) + "_f";

        var info = MICEParserUtils.parseLogitudeFormat(str, 0, false);

        expect(info).to.be.eql(99 + 7.74 / 60);
    });

    it('MIC-E state', function () {
        //0, 0, 1 custom
        var info = MICEParserUtils.getStateFromMessage([0, 0, 1]);

        expect(info).to.be.eql(Models.MICEPosition.State.C6);
    });
});