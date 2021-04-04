'use strict';

const SymbolIconUtils = require('../SymbolIconUtils');

function StatusReport() {
}

StatusReport.prototype.setTimestamp = function (timestamp) {
    this.timestamp = timestamp;
};

StatusReport.prototype.setStatusText = function (statusText) {
    this.statusText = statusText;
};

StatusReport.prototype.setSymbol = function (symbol) {
    this.symbol = symbol;
    const symbolIcon = SymbolIconUtils.getSymbolMeaning(symbol);
    if (symbolIcon) this.symbolIcon = symbolIcon;
};

StatusReport.prototype.setERP = function (code) {
    const asciiCode = code.charCodeAt(0);
    const zeroCode = '0'.charCodeAt(0);

    const erpNumber = asciiCode - zeroCode;

    if(erpNumber >= 0 && erpNumber <= 27) {
        this.erp = Math.pow(erpNumber, 2) * 10;
    }
    else {
        throw new Error('Wrong ERP in status report');
    }
};

StatusReport.prototype.setBeamHeading = function (code) {
    const firstLetter = code[0];

    if(firstLetter >= '0' && firstLetter <= '9') {
        this.beamHeadingDeg = parseInt(firstLetter) * 10;
    }
    else if(firstLetter >= 'A' && firstLetter <= 'Z') {
        const charNumber = firstLetter.charCodeAt(0) - 'A'.charCodeAt(0);
        const alphLen = 'Z'.charCodeAt(0) - 'A'.charCodeAt(0);
        this.beamHeadingDeg = (charNumber * (250 / alphLen)) + 100;
    }
    else
        throw new Error('Wrong beam heading in status report');
};

StatusReport.prototype.setLocator = function (locator) {
    this.locator = locator;
};

module.exports = StatusReport;