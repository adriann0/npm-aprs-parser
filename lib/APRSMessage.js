'use strict';

function APRSMessage(from, to, digiArray) {
    this.setHeaderInfo(from, to, digiArray);
}

APRSMessage.prototype.setRawData = function (rawString) {
    this.raw = rawString;
};

APRSMessage.prototype.setHeaderInfo = function (from, to, digiArray) {
    this.from = from;
    this.to = to;
    this.via = digiArray;
};

APRSMessage.prototype.setBody = function (body) {
    this.data = body;
};

APRSMessage.prototype.setErrors = function (errors) {
    this.errors = errors;
};

module.exports = APRSMessage;