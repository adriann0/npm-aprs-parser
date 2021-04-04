'use strict';

const net = require('net');
const readline = require('readline');
const EventEmitter = require('events').EventEmitter;

const APRSParser = require('./APRSParser');

const APRSServer = 'rotate.aprs2.net';
const APRSPort = 10152;

function APRSISConnector() {
    const that = this;
    const parser = new APRSParser();

    this.on('raw', (line) => {
        const parsed = parser.parse(line);
        that.emit('aprs', parsed);

        if (parsed.data)
            that.emit('aprs-success', parsed);
        else {
            if (parsed.errors)
                that.emit('aprs-failure', parsed);
            else
                that.emit('aprs-unknown', parsed);
        }
    });
}

APRSISConnector.constructor = APRSISConnector;
APRSISConnector.prototype = Object.create(EventEmitter.prototype);

APRSISConnector.prototype.connect = function (callsign) {
    if (this.client) {
        this.disconnect();
    }

    this.client = new net.Socket();
    this.client.setEncoding('utf-8');
    const that = this;

    const rl = readline.createInterface({
        input: this.client
    });

    rl.on('line', (line) => {
        if (!line.startsWith('#'))
            that.emit('raw', line);
    });

    that.client.connect(APRSPort, APRSServer, () => {
        that.client.write('user ' + callsign + '\n');
        that.emit('connected');
    });

    that.client.on('close', () => {
        that.emit('disconnected');
    });
};

APRSISConnector.prototype.disconnect = function () {
    this.client.end();
    this.emit('disconnected');
};

module.exports = APRSISConnector;