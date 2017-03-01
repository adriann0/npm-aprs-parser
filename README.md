# npm-aprs-parser

JavaScript library for parsing [APRS](http://www.aprs.org/) packets. 

## Code Example

```javascript
    var aprs = require("aprs-parser");
    
    var parser = new aprs.APRSParser();

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



Library by [adriann0](https://github.com/adriann0)

Modified to include radio, Mic-E altitude, and symbol icons by [Kris Linquist](http://www.github.com/klinquist) 