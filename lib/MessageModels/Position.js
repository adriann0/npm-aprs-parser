'use strict';

const symbolDict = {

    //Primary symbols (/)
    '47': {
        '33': 'Police Stn',
        '34': 'No Symbol',
        '35': 'Digi',
        '36': 'Phone',
        '37': 'DX Cluster',
        '38': 'HF Gateway',
        '39': 'Plane sm',
        '40': 'Mob Sat Stn',
        '41': 'WheelChair',
        '42': 'Snowmobile',
        '43': 'Red Cross',
        '44': 'Boy Scout',
        '45': 'Home',
        '46': 'X',
        '47': 'Red Dot',
        '48': 'Circle (0)',
        '49': 'Circle (1)',
        '50': 'Circle (2)',
        '51': 'Circle (3)',
        '52': 'Circle (4)',
        '53': 'Circle (5)',
        '54': 'Circle (6)',
        '55': 'Circle (7)',
        '56': 'Circle (8)',
        '57': 'Circle (9)',
        '58': 'Fire',
        '59': 'Campground',
        '60': 'Motorcycle',
        '61': 'Rail Eng.',
        '62': 'Car',
        '63': 'File svr',
        '64': 'HC Future',
        '65': 'Aid Stn',
        '66': 'BBS',
        '67': 'Canoe',
        '68': 'No Symbol',
        '69': 'Eyeball',
        '70': 'Tractor',
        '71': 'Grid Squ.',
        '72': 'Hotel',
        '73': 'Tcp/ip',
        '74': 'No Symbol',
        '75': 'School',
        '76': 'Usr Log-ON',
        '77': 'MacAPRS',
        '78': 'NTS Stn',
        '79': 'Balloon',
        '80': 'Police',
        '81': 'TBD',
        '82': 'Rec Vehicle',
        '83': 'Shuttle',
        '84': 'SSTV',
        '85': 'Bus',
        '86': 'ATV',
        '87': 'WX Service',
        '88': 'Helo',
        '89': 'Yacht',
        '90': 'WinAPRS',
        '91': 'Jogger',
        '92': 'Triangle',
        '93': 'PBBS',
        '94': 'Plane lrge',
        '95': 'WX Station',
        '96': 'Dish Ant.',
        '97': 'Ambulance',
        '98': 'Bike',
        '99': 'ICP',
        '100': 'Fire Station',
        '101': 'Horse',
        '102': 'Fire Truck',
        '103': 'Glider',
        '104': 'Hospital',
        '105': 'IOTA',
        '106': 'Jeep',
        '107': 'Truck',
        '108': 'Laptop',
        '109': 'Mic-E Rptr',
        '110': 'Node',
        '111': 'EOC',
        '112': 'Rover',
        '113': 'Grid squ.',
        '114': 'Antenna',
        '115': 'Power Boat',
        '116': 'Truck Stop',
        '117': 'Truck 18wh',
        '118': 'Van',
        '119': 'Water Stn',
        '120': 'XAPRS',
        '121': 'Yagi',
        '122': 'Shelter',
        '123': 'No Symbol',
        '124': 'TNC Stream Sw',
        '125': 'No Symbol',
        '126': 'TNC Stream Sw'
    },

    //Alternate symbols (\)
    '92': {
        '33': 'Emergency',
        '34': 'No Symbol',
        '35': 'No. Digi',
        '36': 'Bank',
        '37': 'No Symbol',
        '38': 'No. Diamond',
        '39': 'Crash site',
        '40': 'Cloudy',
        '41': 'MEO',
        '42': 'Snow',
        '43': 'Church',
        '44': 'Girl Scout',
        '45': 'Home (HF)',
        '46': 'UnknownPos',
        '47': 'Destination',
        '48': 'No. Circle',
        '49': 'No Symbol',
        '50': 'No Symbol',
        '51': 'No Symbol',
        '52': 'No Symbol',
        '53': 'No Symbol',
        '54': 'No Symbol',
        '55': 'No Symbol',
        '56': 'No Symbol',
        '57': 'Petrol Stn',
        '58': 'Hail',
        '59': 'Park',
        '60': 'Gale Fl',
        '61': 'No Symbol',
        '62': 'No. Car',
        '63': 'Info Kiosk',
        '64': 'Hurricane',
        '65': 'No. Box',
        '66': 'Snow blwng',
        '67': 'Coast Guard',
        '68': 'Drizzle',
        '69': 'Smoke',
        '70': 'Freezing Rain',
        '71': 'Snow Shwr',
        '72': 'Haze',
        '73': 'Rain Shwr',
        '74': 'Lightning',
        '75': 'Kenwood',
        '76': 'Lighthouse',
        '77': 'No Symbol',
        '78': 'Nav Buoy',
        '79': 'Rocket',
        '80': 'Parking  ',
        '81': 'Quake',
        '82': 'Restaurant',
        '83': 'Sat/Pacsat',
        '84': 'Thunderstorm',
        '85': 'Sunny',
        '86': 'VORTAC',
        '87': 'No. WXS',
        '88': 'Pharmacy',
        '89': 'No Symbol',
        '90': 'No Symbol',
        '91': 'Wall Cloud',
        '92': 'No Symbol',
        '93': 'No Symbol',
        '94': 'No. Plane',
        '95': 'No. WX Stn',
        '96': 'Rain',
        '97': 'No. Diamond',
        '98': 'Dust blwng',
        '99': 'No. CivDef',
        '100': 'DX Spot',
        '101': 'Sleet',
        '102': 'Funnel Cld',
        '103': 'Gale',
        '104': 'HAM store',
        '105': 'No. Blk Box',
        '106': 'WorkZone',
        '107': 'SUV',
        '108': 'Area Locns',
        '109': 'Milepost',
        '110': 'No. Triang',
        '111': 'Circle sm',
        '112': 'Part Cloud',
        '113': 'No Symbol',
        '114': 'Restrooms',
        '115': 'No. Boat',
        '116': 'Tornado',
        '117': 'No. Truck',
        '118': 'No. Van',
        '119': 'Flooding',
        '120': 'No Symbol',
        '121': 'Sky Warn',
        '122': 'No. Shelter',
        '123': 'Fog',
        '124': 'TNC Stream SW',
        '125': 'No Symbol',
        '126': 'TNC Stream SW'
    }
};

function Position(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
}


Position.prototype.setExtension = function (extensionData) {
    this.extension = extensionData;
};

Position.prototype.setAltitude = function (altitudeMeters) {
    this.altitude = altitudeMeters;
};

Position.prototype.setTimestamp = function (timestamp) {
    this.timestamp = timestamp;
};

Position.prototype.setSymbol = function (symbol) {
    this.symbol = symbol;
    let symbolIcon = symbolDict[symbol.charCodeAt(0)] && symbolDict[symbol.charCodeAt(0)][symbol.charCodeAt(1)] || symbolDict[symbol.charCodeAt(1)] && symbolDict[symbol.charCodeAt(0)][symbol.charCodeAt(0)];
    if (symbolIcon) this.symbolIcon = symbolIcon;
};

Position.prototype.setMessagingEnabled = function (enabled) {
    this.msgEnabled = enabled;
};


Position.prototype.setComment = function (message) {
    this.comment = message;
};

Position.prototype.setWeather = function (message) {
    this.weather = message;
};

module.exports = Position;