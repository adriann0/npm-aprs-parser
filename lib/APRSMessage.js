'use strict';

function APRSMessage(from, to, digiArray) {
    this.from = from;
    this.to = to;
    this.digi = digiArray;
}

module.exports = APRSMessage;