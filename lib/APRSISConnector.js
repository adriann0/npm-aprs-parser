'use strict';

var net = require('net');
const readline = require('readline');
var EventEmitter = require("events").EventEmitter;

var APRSParser = require("./APRSParser");

const APRSServer = 'rotate.aprs2.net';
const APRSPort = 10152;
const reconnectRetrySeconds = 10;

function APRSISConnector() {
    var that = this;
    var parser = new APRSParser();

    this.on("raw", function (line) {
        var parsed;
        try {
            parsed = parser.parse(line);
        } catch (e) {
            parsed = {
                raw: line,
                errors: [e]
            };
        }
        that.emit("aprs", parsed);
        if (parsed.data)
            that.emit("aprs-success", parsed);
        else {
            if (parsed.errors)
                that.emit("aprs-failure", parsed);
            else
                that.emit("aprs-unknown", parsed);
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
    this.client.setEncoding("utf-8");
    var that = this;

    const rl = readline.createInterface({
        input: this.client
    });

    rl.on("line", function (line) {
        if (!line.startsWith("#"))
            that.emit("raw", line);
    });

    function connectToARPSServer() {
        that.client.connect(APRSPort, APRSServer, function () {
            that.client.write("user " + callsign + "\n");
            console.log(`Connected to APRS server ${APRSServer}:${APRSPort}`);
            that.emit("connected");
        });
    }
    connectToARPSServer();

    that.client.on("error", function (e) {
        console.log(`Connection error: ${e}`);
    });

    that.client.on("close", function () {
        that.emit("disconnected");
        console.log(`Disconnected from APRS. Attempting reconnect in ${reconnectRetrySeconds} seconds.`);
        that.client = null;
        setTimeout(() => {
            connectToARPSServer();
        }, reconnectRetrySeconds * 1000);
    });
};

APRSISConnector.prototype.disconnect = function () {
    this.client.end();
    this.emit("disconnected");
};

module.exports = APRSISConnector;