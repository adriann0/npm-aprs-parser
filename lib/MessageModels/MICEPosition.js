'use strict';

var Position = require("./Position.js");

const radioLookupDict = {
    prefixes: [">", "]", "`", "'"],

    //Ref:  http://www.aprs.org/aprs12/mic-e-types.txt
    lookups: [
        {
            prefix: '>',
            suffix: 'v',
            name: 'Kenwood TH-D7A Mobile'
        },
        {
            prefix: ']',
            suffix: '',
            name: 'Kenwood TM-D700 Mobile'
        },
        {
            prefix: ']',
            suffix: '=',
            name: 'Kenwood TM-D710 Mobile'
        },
        {
            prefix: '>',
            suffix: '=',
            name: 'Kenwood TH-D72 Handheld'
        },
        {
            prefix: '>',
            suffix: '^',
            name: 'Kenwood TH-D74 Handheld'
        },
        {
            prefix: '`',
            suffix: '_ ',
            name: 'Yaesu VX-8 Handheld'
        },
        {
            prefix: '`',
            suffix: '_#',
            name: 'Yaesu VX-8G Handheld'
        },
        {
            prefix: '`',
            suffix: '_$',
            name: 'Yaesu FT1D Handheld'
        },
        {
            prefix: '`',
            suffix: '_"',
            name: 'Yaesu FTM-350 Mobile'
        },
        {
            prefix: '`',
            suffix: '_%',
            name: 'Yaesu FTM-400DR Mobile'
        },
        {
            prefix: '`',
            suffix: '_)',
            name: 'Yaesu FT2D Handheld'
        },
        {
            prefix: '\'',
            suffix: '|3',
            name: 'Byonics TinyTrack3'
        },
        {
            prefix: '\'',
            suffix: '|4',
            name: 'Byonics TinyTrack4'
        }
    ]

};

function MICEPosition(latitude, longitude) {
    Position.call(this, latitude, longitude);
}

MICEPosition.prototype = Object.create(Position.prototype);
MICEPosition.prototype.constructor = MICEPosition;

MICEPosition.prototype.setMICEState = function (state) {
    this.mice = state;
};

MICEPosition.prototype.setRadio = function (message) {
    if (radioLookupDict.prefixes.indexOf(message.substr(0, 1)) > -1) {
        radioLookupDict.lookups.forEach((radio) => {
            if (message.substr(0, 1) == radio.prefix && message.substr(0 - radio.suffix.length) == radio.suffix
    )
        {
            this.radio = radio.name; //Set radio name
            message = message.substr(radio.prefix.length, message.length - radio.suffix.length - 1);  //Remove radio designators from comment
        }
    })
        ;
    }
    return message;
};

MICEPosition.prototype.getAltitudeFromMICE = function (comment) {
    let altitude;
    let msgString = comment.substr(0, 5).match(/(...)}/);  //Alt is in the format XXX}  where XXX = base91 encoded altitude in meters
    if (msgString && msgString[1]) {
        let value = 0;
        for (let i = 0; i < msgString[1].length; i++) {
            value = value * 91 + msgString[1].charCodeAt(i) - 33;
        }
        altitude = value - 10000;
    }
    if (altitude) {
        this.altitude = altitude;
        this.comment = comment.substr(comment.indexOf('}') + 1);  //Remove altitude info from comment
    }
};

MICEPosition.State = {
    "M0": "off duty",
    "M1": "en route",
    "M2": "in service",
    "M3": "returning",
    "M4": "commited",
    "M5": "special",
    "M6": "priority",
    "C0": "custom-0",
    "C1": "custom-1",
    "C2": "custom-2",
    "C3": "custom-3",
    "C4": "custom-4",
    "C5": "custom-5",
    "C6": "custom-6",
    "EMERGENCY": "emergency",
    "UNKNOWN": "unknown"
};

module.exports = MICEPosition;