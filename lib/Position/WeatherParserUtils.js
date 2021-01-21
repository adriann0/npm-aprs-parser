

const wind_multiplier = 0.44704;
const rain_multiplier = 0.254;
const weatherRegEx = new RegExp(/([cSgtrpPlLs#]\d{3}|t-\d{2}|h\d{2}|b\d{5}|s\.\d{2}|s\d\.\d)/g);

const weatherMap = {
    'g': {
        keyName: 'wind_gust',
        val: x => { return Number(x) * wind_multiplier; }
    },
    'c': {
        keyName: 'wind_direction',
        val: x => { return Number(x); }
    },
    't': {
        keyName: 'temperature',
        val: x => { return (Number(x) - 32) / 1.8; }
    },
    'S': {
        keyName: 'wind_speed',
        val: x => { return Number(x) * wind_multiplier; }
    },
    'r': {
        keyName: 'rain_1h',
        val: x => { return Number(x) * rain_multiplier; }
    },
    'p': {
        keyName: 'rain_24h',
        val: x => { return Number(x) * rain_multiplier; }
    },
    'P': {
        keyName: 'rain_since_midnight',
        val: x => { return Number(x) * rain_multiplier; }
    },
    'h': {
        keyName: 'humidity',
        val: x => { return Number(x); }
    },
    'b': {
        keyName: 'pressure',
        val: x => { return Number(x) / 10; }
    },
    'l': {
        keyName: 'luminosity',
        val: x => { return Number(x) + 1000; }
    },
    'L': {
        keyName: 'luminosity',
        val: x => { return Number(x); }
    },
    's': {
        keyName: 'snow',
        val: x => { return Number(x) * 25.4; }
    },
    '#': {
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
            if (weatherMap[weatherRegexMatch[i].substr(0, 1)]) {
                weather[weatherMap[weatherRegexMatch[i].substr(0, 1)].keyName] = weatherMap[weatherRegexMatch[i].substr(0, 1)].val(weatherRegexMatch[i].substr(1));
            }
        }
        //remove weather data from the body content
        comment = comment.substr(0,comment.indexOf(weatherRegexMatch[0])) + comment.substr(comment.indexOf(weatherRegexMatch[weatherRegexMatch.length - 1]) + weatherRegexMatch[weatherRegexMatch.length - 1].length);
        return {
            weather, comment
        };
    }
};