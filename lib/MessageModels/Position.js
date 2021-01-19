'use strict';

const SymbolIconUtils = require('../SymbolIconUtils');

function Position(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
}

Position.prototype.setExtension = function (extensionData) {
    this.extension = extensionData;
};

Position.prototype.setAltitude = function (altitudeMeters) {
    this.altitude = altitudeMeters;
};

Position.prototype.setTimestamp = function (timestamp) {
    this.timestamp = timestamp;
};

Position.prototype.setSymbol = function (symbol) {
    this.symbol = symbol;
    const symbolIcon = SymbolIconUtils.getSymbolMeaning(symbol);
    if (symbolIcon) this.symbolIcon = symbolIcon;
};

Position.prototype.setMessagingEnabled = function (enabled) {
    this.msgEnabled = enabled;
};


Position.prototype.setComment = function (message) {
    this.comment = message;
};

module.exports = Position;