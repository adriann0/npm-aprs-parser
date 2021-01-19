'use strict';

function Message(addressee) {
    this.addressee = addressee;
}

Message.prototype.setText = function (text) {
    this.text = text;
    this.type = this.Types.MSG;
};

Message.prototype.setId = function (id) {
    this.id = id;
};

Message.prototype.setToAck = function () {
    delete this.text;
    this.type = this.Types.ACK;
};

Message.prototype.setToRej = function () {
    delete this.text;
    this.type = this.Types.REJ;
};

Message.prototype.Types = {MSG: 'msg', ACK: 'ack', REJ: 'rej'};

module.exports = Message;