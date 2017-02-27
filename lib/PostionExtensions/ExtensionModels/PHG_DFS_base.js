'use strict'

function PHG_DFS_base() {

    this.heightFeet = 10;
    this.gaindB = 0;
    this.directivityDeg = 0;
}

PHG_DFS_base.prototype.setHeightCode = function(code) {
    if(code >= 10 || code < 0)
        throw new Error("Illegal height code");

    this.heightFeet = 10 * Math.pow(2, code);
}

PHG_DFS_base.prototype.setGainCode = function(code) {
    if(code >= 10 || code < 0)
        throw new Error("Illegal gain code");

    this.gaindB = code;
}

PHG_DFS_base.prototype.setDirectivityCode = function(code) {
    if(code >= 9 || code < 0)
        throw new Error("Illegal directivity code");

    this.directivityDeg = code * 45;
}

module.exports = PHG_DFS_base;