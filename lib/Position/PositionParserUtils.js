'use strict';

var UncompressedPositionParserUtil = require("./UncompressedPositionParserUtil.js");
var CompressedPositionUtil = require("./CompressedPositionUtil.js");
var Position = require("./../MessageModels/Position.js");

var tryParseNotCompressed = function (contentWithoutTimestamp) {
    var symbol = contentWithoutTimestamp[8] + contentWithoutTimestamp[18];
    var latitudeString = contentWithoutTimestamp.substr(0, 8);
    var longitudeString = contentWithoutTimestamp.substr(9, 9);

    var position = new Position(UncompressedPositionParserUtil.fromDMtoDecimalLatitude(latitudeString), UncompressedPositionParserUtil.fromDMtoDecimalLongitude(longitudeString));

    position.setSymbol(symbol);
    return position;
};

var tryParseCompressed = function (contentWithoutTimestamp) {
    return CompressedPositionUtil.getPositionForCompressedString(contentWithoutTimestamp);
};

module.exports = {
    parsePositionAndCommentString: function (stringPartWithPosAndComment) {
        var position;
        var comment;

        if (isNaN(parseInt(stringPartWithPosAndComment[0]))) {
            //probably compressed format
            position = tryParseCompressed(stringPartWithPosAndComment.substr(0, 13));
            comment = stringPartWithPosAndComment.substr(13);
        }
        else {
            //probably not compressed
            position = tryParseNotCompressed(stringPartWithPosAndComment.substr(0, 19));
            comment = stringPartWithPosAndComment.substr(19);
        }

        if (comment && comment.length > 0) {
            var parsedFromComment = UncompressedPositionParserUtil.parseAltitudeAndExtension(comment);

            if (parsedFromComment.extension)
                position.setExtension(parsedFromComment.extension);

            if (parsedFromComment.altitude)
                position.setAltitude(parsedFromComment.altitude);

            if (parsedFromComment.comment)
                position.setComment(parsedFromComment.comment);
        }

        return position;
    },

    parseTimestamp: function (timestampString) {
        var now = new Date();

        var ints = [parseInt(timestampString.substr(0, 2)), parseInt(timestampString.substr(2, 2)), parseInt(timestampString.substr(4, 2))];

        if (isNaN(ints[0]) || isNaN(ints[1]) || isNaN(ints[2])) {
            throw new Error("NaN in timestamp:" + ints);
        }

        if (timestampString[6] == 'z') {
            now.setUTCDate(ints[0]);
            now.setUTCHours(ints[1], ints[2], 0, 0);
        }
        else if (timestampString[6] == 'h') {
            now.setUTCHours(ints[0], ints[1], ints[2], 0);
        }
        else if (timestampString[6] == '/') {
            throw new Error("Zulu time should be used, not local");
        }
        else
            return;

        return now;
    }
};