'use strict';

var Position = require("./Position.js");

function MICEPosition(latitude, longitude) {
    Position.call(this, latitude, longitude);
}

MICEPosition.prototype = Object.create(Position.prototype);
MICEPosition.prototype.constructor = MICEPosition;

MICEPosition.prototype.setMICEState = function (state) {
    this.mice = state;
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