'use strict';

function TelemetryLabels(call, labels) {
    this.call = call;
    this.labels = labels;
}

module.exports = TelemetryLabels;