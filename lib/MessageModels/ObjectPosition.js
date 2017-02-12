'use strict';

var Position = require("./Position.js");

function ObjectPosition(objectName, status, latitude, longitude) {
    this.name = objectName;
    this.status = status;
    Position.call(this, latitude, longitude);
}

ObjectPosition.prototype = Object.create(Position.prototype);
ObjectPosition.prototype.constructor = ObjectPosition;

ObjectPosition.Status = {
    "LIVE": "live",
    "KILLED": "killed"
};

module.exports = ObjectPosition;