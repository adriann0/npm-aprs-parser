'use strict';

function APRSMessage(from, to, digiArray) {
    this.from = from;
    this.to = to;
    this.via = digiArray;
}

APRSMessage.prototype.setBody = function (body) {
    this.data = body;
};

module.exports = APRSMessage;