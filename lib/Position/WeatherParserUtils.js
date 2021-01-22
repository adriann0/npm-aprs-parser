

const windMultiplier = 0.44704;
const rainMultiplier = 0.254;
const weatherRegEx = new RegExp(/([cSgtrpPlLs#]\d{3}|t-\d{2}|h\d{2}|b\d{5}|s\.\d{2}|s\d\.\d)/g);

const weatherMap = {
    'g': { //peak wind speed in the past 5 minutes, in mph (converting it to kmph)
        keyName: 'wind_gust',
        val: x => { return Number(x) * windMultiplier; }
    },
    'c': { //wind direction in degrees
        keyName: 'wind_direction',
        val: x => { return Number(x); }
    },
    't': { //Temperature in fahrenheit, converting it to celsius
        keyName: 'temperature',
        val: x => { return (Number(x) - 32) / 1.8; }
    },
    'S': { //sustained one-minute wind speed, in mph (converting it to kmph)
        keyName: 'wind_speed',
        val: x => { return Number(x) * windMultiplier; }
    },
    'r': { //Rainfall in hundredths of an inch, converting it to cm.
        keyName: 'rain_1h',
        val: x => { return Number(x) * rainMultiplier; }
    },
    'p': { //Rainfall in hundredths of an inch, converting it to cm.
        keyName: 'rain_24h',
        val: x => { return Number(x) * rainMultiplier; }
    },
    'P': { //Rainfall in hundredths of an inch, converting it to cm.
        keyName: 'rain_since_midnight',
        val: x => { return Number(x) * rainMultiplier; }
    },
    'h': {  //Relative humidity in %
        keyName: 'humidity',
        val: x => { return Number(x); }
    },
    'b': { //barometric pressure (in tenths of millibars, converting it to millibars)
        keyName: 'pressure',
        val: x => { return Number(x) / 10; }
    },
    'l': { ////Luminosity (in watts per square meter) 1000 and above
        keyName: 'luminosity',
        val: x => { return Number(x) + 1000; }
    },
    'L': {  //Luminosity (in watts per square meter) 999 and below
        keyName: 'luminosity',
        val: x => { return Number(x); }
    },
    's': {  //Snowfall in the last 24 hours, inches converting to cm
        keyName: 'snow',
        val: x => { return Number(x) * 25.4; }
    },
    '#': {  // raw rain counter
        keyName: 'rain_raw',
        val: x => { return Number(x); }
    }
};

module.exports = {
    parseWeatherData: function (comment) {
        const weatherRegexMatch = comment.match(weatherRegEx);
        if (!weatherRegexMatch) return;
        const weather = {};
        for (let i = 0; i < weatherRegexMatch.length; i++){
            if (weatherMap[weatherRegexMatch[i][0]]) {
                const weatherFieldInfo = weatherMap[weatherRegexMatch[i][0]];
                weather[weatherFieldInfo.keyName] = weatherFieldInfo.val(weatherRegexMatch[i].substr(1));
            }
        }
        //remove weather data from the body content
        comment = comment.substr(0,comment.indexOf(weatherRegexMatch[0])) + comment.substr(comment.indexOf(weatherRegexMatch[weatherRegexMatch.length - 1]) + weatherRegexMatch[weatherRegexMatch.length - 1].length);
        return {
            weather, comment
        };
    }
};
