'use strict';
var AbstractParser = require("../AbstractParser.js");

var Callsign = require("../Callsign.js");
var Message = require("./../MessageModels/Message.js");

function MessageParser() {

}

var tryParseMsgId = function (messageBody) {
    var posId = messageBody.indexOf("{");

    if (posId < 0) {
        return {content: messageBody};
    } else {
        var idString = messageBody.substr(posId + 1);
        if (idString.endsWith('}')) {
            idString = idString.substr(0, idString.length - 1);
        }
        if (!idString.match("^[0-9a-zA-Z]{1,5}")) {
            throw new Error("Wrong message id?");
        }
        else {
            return {content: messageBody.substr(0, posId), id: parseInt(idString)};
        }
    }
};

MessageParser.constructor = MessageParser;
MessageParser.prototype = Object.create(AbstractParser.prototype);

MessageParser.prototype.isMatching = function (bodyContent) {
    return bodyContent[0] == ":";
};

MessageParser.prototype.tryParse = function (bodyContent, aprsMessageHeader) {
    var addressee = new Callsign(bodyContent.substr(1, 9).trim());
    var message = new Message(addressee);

    if (bodyContent[10] != ":") {
        throw Error("Wrong message format");
    }

    //remove :9 characters:
    var messageBody = bodyContent.substr(11);

    if (messageBody.startsWith("ack") || messageBody.startsWith("rej")) {
        var ackRejIdString = messageBody.substr(3);
        if (!ackRejIdString.match("^[0-9]{1,5}")) {
            throw new Error("Wrong ACK/REJ id?");
        }

        message.setId(parseInt(ackRejIdString));

        if (messageBody.startsWith("ack"))
            message.setToAck();
        else
            message.setToRej();
    }
    else {
        var parsedMessage = tryParseMsgId(messageBody);
        message.setText(parsedMessage.content);

        if (parsedMessage.id)
            message.setId(parsedMessage.id);
    }

    return message;
};

MessageParser.prototype.getParserName = function () {
    return "MessageParser";
};

module.exports = MessageParser;