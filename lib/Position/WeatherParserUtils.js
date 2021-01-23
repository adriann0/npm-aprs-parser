'use strict';

const windMultiplier = 0.44704;
const rainMultiplier = 0.254;

const weatherParsingMap = {
    'g': { //peak wind speed in the past 5 minutes, in mph (converting it to kmph)
        valueName: 'windGust',
        valueConversionFunction: x => { return Number(x) * windMultiplier; },
        valueLength: 3
    },
    'c': { //wind direction in degrees
        valueName: 'windDirection',
        valueConversionFunction: x => { return Number(x); },
        valueLength: 3
    },
    't': { //Temperature in fahrenheit, converting it to celsius
        valueName: 'temperature',
        valueConversionFunction: x => { return (Number(x) - 32) / 1.8; },
        valueLength: 3
    },
    'S': { //sustained one-minute wind speed, in mph (converting it to kmph)
        valueName: 'windSpeed',
        valueConversionFunction: x => { return Number(x) * windMultiplier; },
        valueLength: 3
    },
    'r': { //Rainfall in hundredths of an inch, converting it to cm.
        valueName: 'rain1h',
        valueConversionFunction: x => { return Number(x) * rainMultiplier; },
        valueLength: 3
    },
    'p': { //Rainfall in hundredths of an inch, converting it to cm.
        valueName: 'rain24h',
        valueConversionFunction: x => { return Number(x) * rainMultiplier; },
        valueLength: 3
    },
    'P': { //Rainfall in hundredths of an inch, converting it to cm.
        valueName: 'rainSinceMidnight',
        valueConversionFunction: x => { return Number(x) * rainMultiplier; },
        valueLength: 3
    },
    'h': {  //Relative humidity in %
        valueName: 'humidity',
        valueConversionFunction: x => { return Number(x); },
        valueLength: 2
    },
    'b': { //barometric pressure (in tenths of millibars, converting it to millibars)
        valueName: 'pressure',
        valueConversionFunction: x => { return Number(x) / 10; },
        valueLength: 5
    },
    'l': { ////Luminosity (in watts per square meter) 1000 and above
        valueName: 'luminosity',
        valueConversionFunction: x => { return Number(x) + 1000; },
        valueLength: 3
    },
    'L': {  //Luminosity (in watts per square meter) 999 and below
        valueName: 'luminosity',
        valueConversionFunction: x => { return Number(x); },
        valueLength: 3
    },
    's': {  //Snowfall in the last 24 hours, inches converting to cm
        valueName: 'snow',
        valueConversionFunction: x => { return Number(x) * 25.4; },
        valueLength: 3
    },
    '#': {  // raw rain counter
        valueName: 'rainRaw',
        valueConversionFunction: x => { return Number(x); },
        valueLength: 3
    }
};

function isUnknownWeatherValue(rawValue) {
    return rawValue == " ".repeat(rawValue.length) || rawValue == ".".repeat(rawValue.length);
}

module.exports = {
    parseWeatherData: function (comment) {
        let commentCurentPosition = 0;
        const weather = {};

        while (true) {
            const parsedWeatherSymbol = weatherParsingMap[comment[commentCurentPosition]];

            if (!parsedWeatherSymbol) {
                // current letter doesn't look like weather symbol, skip parsing the rest of message
                break;
            }
            
            // extract raw weather value (skip weather symbol)
            const rawSymbolValue = comment.substr(commentCurentPosition + 1, parsedWeatherSymbol.valueLength);

            const symbolValue = parsedWeatherSymbol.valueConversionFunction(rawSymbolValue);
            if (!isNaN(symbolValue)) {
                weather[parsedWeatherSymbol.valueName] = symbolValue;
            } 
            else {
                // Value is not a number. Some string values describe unknown / irrelevant data - in that cases we should continue parsing (just skip current field).
                // Otherwise value is illegal and we should stop parsing.

                if (!isUnknownWeatherValue(rawSymbolValue)) {
                    // illegal value
                    break;
                }
            }

            // advance by symbol and value lenght
            commentCurentPosition += 1 + parsedWeatherSymbol.valueLength;
        }

        if (commentCurentPosition > 0) {
            // remove parsed weather information from comment
            comment = comment.substr(commentCurentPosition);

            return {
                weather, comment
            };
        }
    }
};