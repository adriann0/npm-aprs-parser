'use strict';

var base = require("./PHG_DFS_base.js");

function DFS() {
    base.call(this);

    this.strengthS = 0;
}

DFS.prototype = Object.create(base.prototype);
DFS.prototype.constructor = DFS;

DFS.prototype.setStrengthCode = function(strength) {
    if(strength >= 10 || strength < 0)
        throw new Error("Illegal strength code");

    this.strengthS = strength;
}

module.exports = DFS;