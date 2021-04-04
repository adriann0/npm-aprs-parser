'use strict';

const base = require('./PHG_DFS_base.js');

function PHG() {
    base.call(this);

    this.powerWatts = 0;
}

PHG.prototype = Object.create(base.prototype);
PHG.prototype.constructor = PHG;

PHG.prototype.setPowerCode = function(code) {
    if(code >= 10 || code < 0)
        throw new Error('Illegal power code');

    this.powerWatts = Math.pow(code, 2);
};

module.exports = PHG;