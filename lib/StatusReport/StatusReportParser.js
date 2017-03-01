'use strict';

var AbstractParser = require("../AbstractParser.js");
var Models = require("../MessageModels");
var PositionParserUtils = require("../Position/PositionParserUtils");

function StatusReportParser() {

}

StatusReportParser.constructor = StatusReportParser;
StatusReportParser.prototype = Object.create(AbstractParser.prototype);

StatusReportParser.prototype.isMatching = function (bodyContent) {
    return bodyContent[0] == ">";
};

StatusReportParser.prototype.tryParse = function (bodyContent, aprsMessageHeader) {
    var report = new Models.StatusReport();

    var maidenheadLocator = bodyContent.match("^>([A-Z]{2}[0-9]{2}[A-Z]{0,2})([/|\\\\].) (.+)"); //regex capturing locator, then symbol and status text
    if(maidenheadLocator) { //status report with locator
        var locator = maidenheadLocator[1];
        var symbol = maidenheadLocator[2];
        bodyContent = maidenheadLocator[3]; //only status

        report.setLocator(locator);
        report.setSymbol(symbol);
    } else { //no locator so might contain timestamp
        try {
            var timestamp = PositionParserUtils.parseTimestamp(bodyContent.substr(1,7));
            if(timestamp) {
                report.setTimestamp(timestamp);
                bodyContent = bodyContent.substr(8); //remove > with timestamp
            }
        }
        catch(ex) {
            //not a timestamp, remove only >
            bodyContent = bodyContent.substr(1);
        }
    }

    //check if ERP and heading set
    if(bodyContent.match("\\^(..)$")) {
        report.setBeamHeading(bodyContent[bodyContent.length - 2]);
        report.setERP(bodyContent[bodyContent.length - 1]); //last character

        bodyContent = bodyContent.substr(0, bodyContent.length - 3); //remove erp and heading information from status
    }

    report.setStatusText(bodyContent);

    return report;
};

StatusReportParser.prototype.getParserName = function () {
    return "StatusReportParser";
};

module.exports = StatusReportParser;