# npm-aprs-parser

JavaScript library for parsing [APRS](http://www.aprs.org/) packets. 

## Code Example

```javascript
    const aprs = require("aprs-parser");
    
    const parser = new aprs.APRSParser();

    console.log(parser.parse("SQ7PFS-10>APRS,TCPIP*,qAC,T2SYDNEY:@085502h4903.50N/07201.75W-PHG5132Hello world/A=001234"));
    console.log();
    console.log(parser.parse("SQ7PFS-10>S32U6T,TCPIP*,qAC,T2SYDNEY:`(_fn\"Oj/>Hellov"));
```

Output:

```
    APRSMessage {
      from: Callsign { ssid: '10', call: 'SQ7PFS' },
      to: Callsign { call: 'APRS' },
      via: 
       [ Callsign { call: 'TCPIP*' },
         Callsign { call: 'qAC' },
         Callsign { call: 'T2SYDNEY' } ],
      raw: 'SQ7PFS-10>APRS,TCPIP*,qAC,T2SYDNEY:@085502h4903.50N/07201.75W-PHG5132Hello world/A=001234',
      data: 
       Position {
         latitude: 49.05833333333333,
         longitude: -72.02916666666667,
         symbol: '/-',
         symbolIcon: 'Home',
         extension: PHG { heightFeet: 20, gaindB: 3, directivityDeg: 90, powerWatts: 25 },
         altitude: 376.1232,
         comment: 'Hello world',
         timestamp: Mon Feb 27 2017 09:55:02 GMT+0100 (CET),
         msgEnabled: true } }
    
    APRSMessage {
      from: Callsign { ssid: '10', call: 'SQ7PFS' },
      to: Callsign { call: 'S32U6T' },
      via: 
       [ Callsign { call: 'TCPIP*' },
         Callsign { call: 'qAC' },
         Callsign { call: 'T2SYDNEY' } ],
      raw: 'SQ7PFS-10>S32U6T,TCPIP*,qAC,T2SYDNEY:`(_fn"Oj/>Hellov',
      data: 
       MICEPosition {
         latitude: 33.42733333333334,
         longitude: -12.129,
         mice: 'returning',
         symbol: '/j',
         symbolIcon: 'Jeep',
         extension: CourseSpeed { courseDeg: 251, speedMPerS: 10.28888888 },
         radio: 'Kenwood TH-D7A Mobile',
         comment: 'Hello' } }

```

## Code Example - weather station support
```javascript
    const aprs = require("aprs-parser");
    
    const parser = new aprs.APRSParser();

    console.log(parser.parse("FW7233>APRS,TCPXX*,qAX,CWOP-2:@231821z5150.13N/01913.68E_239/003g010t042r000p011P011b09969h83L000eMB51"));
```

Output:
```
APRSMessage {
  from: Callsign { call: 'FW7233' },
  to: Callsign { call: 'APRS' },
  via: [
    Callsign { call: 'TCPXX*' },
    Callsign { call: 'qAX' },
    Callsign { ssid: '2', call: 'CWOP' }
  ],
  raw: 'FW7233>APRS,TCPXX*,qAX,CWOP-2:@231821z5150.13N/01913.68E_239/003g010t042r000p011P011b09969h83L000eMB51',
  data: Position {
    latitude: 51.8355,
    longitude: 19.228,
    symbol: '/_',
    symbolIcon: 'WX Station',
    extension: CourseSpeed { courseDeg: 239, speedMPerS: 1.543333332 },
    weather: {
      windGust: 4.4704,
      temperature: 5.555555555555555,
      rain1h: 0,
      rain24h: 2.794,
      rainSinceMidnight: 2.794,
      pressure: 996.9,
      humidity: 83,
      luminosity: 0
    },
    comment: 'eMB51',
    timestamp: 2021-01-23T18:21:00.000Z,
    msgEnabled: true
  }
```

For WX stations with position CourseSpeed extension is used to represent wind speed and direction. Units used in weather report:
- rain1h, rain24h, rainSinceMidnight - millimeters
- windGust - meters per second
- temperature - Celcius
- pressure - millibars
- luminosity - watts per square meter
- snow - centimeters
- humidity - %

## Code Example - APRS Stream

This library also supports connecting to the APRS "firehose".  An amateur radio license is required to connect.


```javascript
    const aprs = require("aprs-parser");
    const stream = new aprs.APRSISConnector;
    stream.connect('YOUR-AMATEUR-RADIO-CALLSIGN');
    
    stream.on('aprs', (event)=>{
        console.log(event)
    });
```


## Installation

```
$ npm install aprs-parser --save
```

## Supported data types

* Position
* Objects
* Current MIC-E
* Telemetry
* Messages
* Status reports

## License

Library is licensed under the GNU Lesser General Public License. 


Library by [adriann0](https://github.com/adriann0) with [Kris Linquist](http://www.github.com/klinquist) as an additioinal contributor.