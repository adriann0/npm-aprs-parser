'use strict';

function Telemetry(id, analogValues, digitalValues) {
    this.id = id;
    this.analog = analogValues;
    this.digital = digitalValues;
}

Telemetry.prototype.setComment = function (comment) {
    this.comment = comment;
};

module.exports = Telemetry;