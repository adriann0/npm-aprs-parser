'use strict';

var checkAndParseCallsign = function (callsign) {
    return callsign;
};

function Callsign(callsignString) {
    var ssidDelimPos = callsignString.indexOf("-");

    if (ssidDelimPos == 0) {
        throw "Empty callsign (only SSID)?";
    }

    if (ssidDelimPos < 0) {
        ssidDelimPos = callsignString.length;
    }
    else {
        var ssidString = callsignString.substr(ssidDelimPos + 1);

        if (ssidString.length < 1) {
            throw "Malformed SSID"
        }

        this.ssid = ssidString;
    }

    this.call = checkAndParseCallsign(callsignString.substr(0, ssidDelimPos));
}

module.exports = Callsign;