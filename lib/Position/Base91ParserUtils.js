'use strict';

const Telemetry = require('./../MessageModels/Telemetry.js');

module.exports = {
    parseBase91Telemetry: (bodyContent) => {
        //Extact and parse Base91 encoded telemetry from this spec: http://he.fi/doc/aprs-base91-comment-telemetry.txt
        //This should be a sequence number, 1-5 TM values, and a character pair for 8 binary values (which can only appear if 5 other values are sent)
        const msgString = bodyContent.match(/(.*)\|([!-{]{4,14})\|(.*)/);
        if (msgString && msgString[2]) { //Found something. [2] is the TM data itself
            const comment = bodyContent.replace('|' + msgString[2] + '|',''); //Remove the TM block from the comment. Need to add the pipes back. Regex stripped them.
            const id = parseBase91(msgString[2].substring(0,2)); //First two characters are required to be sequence number
            const analogValues = []; //We'll have between 1 and 5 analog values in the TM fields
            const digitalValues = []; //This may or may not be empty.
            let tmValues = msgString[2].substring(2);

            while (tmValues.length > 0 && analogValues.length < 5) {
                analogValues.push(parseBase91(tmValues.substring(0,2)));
                tmValues = tmValues.substring(2);
            }
            if (tmValues.length == 2) { //If we made it through 5 analogValues and still have length left on the input string, we've got a pair of characters for binary
                let base91Bools = parseBase91(tmValues.substring(0,2));
                for (let i = 0; i < 8; i++) {
                    digitalValues.push(base91Bools & 1);
                    base91Bools = base91Bools >>> 1;
                }
            }

            const telemetry = new Telemetry(id, analogValues, digitalValues);

            return {telemetry, comment};
        }
        else {
            return;
        }
    }
};

function parseBase91(msgString) {
    let value = 0;
    for (let i = 0; i < msgString.length; i++) {
        value = value * 91 + msgString.charCodeAt(i) - 33;
    }
    return value;
}