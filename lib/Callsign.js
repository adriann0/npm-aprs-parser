'use strict';

const checkAndParseCallsign = function (callsign) {
    return callsign;
};

function Callsign(callsignString) {
    let ssidDelimPos = callsignString.indexOf('-');

    if (ssidDelimPos == 0) {
        throw new Error('Empty callsign (only SSID)?');
    }

    if (ssidDelimPos < 0) {
        ssidDelimPos = callsignString.length;
    }
    else {
        const ssidString = callsignString.substr(ssidDelimPos + 1);

        if (ssidString.length < 1) {
            throw new Error('Malformed SSID');
        }

        this.ssid = ssidString;
    }

    this.call = checkAndParseCallsign(callsignString.substr(0, ssidDelimPos));
}

Callsign.prototype.toString = function () {
    return this.call + (this.ssid ? ('-' + this.ssid) : '');
};

module.exports = Callsign;