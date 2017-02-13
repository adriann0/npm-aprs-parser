# npm-aprs-parser

JavaScript library for parsing [APRS](http://www.aprs.org/) packets. 

## Code Example

```javascript
    var aprs = require("aprs-parser");
    
    var parser = new aprs.APRSParser();
    
    var result = parser.parse("SQ7PFS-10>APRS,TCPIP*,qAC,T2SYDNEY:@085502/4903.50N/07201.75W-Hello world/A=001234");
    
    console.log(result);
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
      raw: 'SQ7PFS-10>APRS,TCPIP*,qAC,T2SYDNEY:@085502/4903.50N/07201.75W-Hello world/A=001234',
      data: 
       Position {
         latitude: 49.05833333333333,
         longitude: -72.02916666666667,
         timestamp: '085502/',
         symbol: '/-',
         msgEnabled: true,
         altitude: 376.1232,
         comment: 'Hello world' } }

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

## License

Library is licensed under the GNU Lesser General Public License. 