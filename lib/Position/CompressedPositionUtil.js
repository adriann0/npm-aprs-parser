'use strict';

var Position = require("./../MessageModels/Position.js");

var valueFromString = function (data) {
    var ret = 0;

    for (var i = 0; i < 4; i++) {
        ret += (data.charCodeAt(i) - 33) * Math.pow(91, 3 - i);
    }

    return ret;
};

module.exports = {
    parseLatitudeCompressed: function (data) {
        if (data.length != 4)
            throw new Error("Wrong compressed latitude / longitude length");

        return 90 - valueFromString(data) / 380926;
    },

    parseLongitudeCompressed: function (data) {
        if (data.length != 4)
            throw new Error("Wrong compressed latitude / longitude length");

        return -180 + valueFromString(data) / 190463;
    },

    getPositionForCompressedString: function (contentWithoutTimestamp) {
        var symbol = contentWithoutTimestamp[0] + contentWithoutTimestamp[9];

        var latitudeString = contentWithoutTimestamp.substr(1, 4);
        var longitudeString = contentWithoutTimestamp.substr(5, 4);

        var position = new Position(this.parseLatitudeCompressed(latitudeString), this.parseLongitudeCompressed(longitudeString));
        position.setSymbol(symbol);

        return position;
    }
};