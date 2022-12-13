// APRS-IS server-side filter strings. http://www.aprs-is.net/javAPRSFilter.aspx for format reference
// The name can be somewhat misleading, as a filter needs to be set to tell the server what traffic to send
// Connecting to a filtered port on an APRS-IS server without specifying a filter will result in no traffic
// We need an include filter to add traffic to the stream (say r/36/-100/200 to get all traffic within 200km
// of 36,-100), but can also have an exclude filter to remove unwanted traffic (say -t/w to exclude weather stations)
// Include flag defaults to true to add traffic to the filter. Set to false to change to exclude filter

'use strict';

function Filter() {

}

Filter.prototype.range = function(lat,long, dist, distUnit = 'km', include = true) {
    if (include) {
        if (this.incRanges)
            this.incRanges.push(lat + '/' + long + '/' + ((distUnit == 'mi') ? milesToKm(dist) : dist));
        else
            this.incRanges = [ lat + '/' + long + '/' + ((distUnit == 'mi') ? milesToKm(dist) : dist) ];
    }
    else {
        if (this.excRanges)
            this.excRanges.push(lat + '/' + long + '/' + ((distUnit == 'mi') ? milesToKm(dist) : dist));
        else
            this.excRanges = [ lat + '/' + long + '/' + ((distUnit == 'mi') ? milesToKm(dist) : dist) ];
    }
};

Filter.prototype.prefix = function(prefix, include = true) {
    if (include) {
        this.incPrefix = checkAndAdd(prefix, this.incPrefix, '/');
    }
    else {
        this.excPrefix = checkAndAdd(prefix, this.excPrefix, '/');
    }
};

// Callsigns can be partial with * wildcards
Filter.prototype.budlist = function(callsign, include = true) {
    if (include) {
        this.incBud = checkAndAdd(callsign, this.incBud, '/');
    }
    else {
        this.excBud = checkAndAdd(callsign, this.excBud, '/');
    }
};

Filter.prototype.object = function(object, include = true) {
    if (include) {
        this.incObj = checkAndAdd(sanitizeObject(object), this.incObj, '/');
    }
    else {
        this.excObj = checkAndAdd(sanitizeObject(object), this.excObj, '/');
    }
};

Filter.prototype.strictObject = function(object, include = true) {
    if (include) {
        this.incStrict = checkAndAdd(sanitizeObject(object), this.incStrict, '/');
    }
    else {
        this.excStrict = checkAndAdd(sanitizeObject(object), this.excStrict, '/');
    }
};

// Valid types:
// p = Position packets
// o = Objects
// i = Items
// m = Message
// q = Query
// s = Status
// t = Telemetry
// u = User-defined
// n = NWS format messages and objects
// w = Weather
Filter.prototype.type = function(type, include = true) {
    if (include) {
        this.incType = checkAndAdd(type, this.incType, '');
    }
    else {
        this.excType = checkAndAdd(type, this.excType, '');
    }
};

// Same types as include/exludeType, but within a distance of a callsign. Can specify multiple types in a single function call, and range will be applied to all
// Example: otq for objects, telemetry, and queries
Filter.prototype.typeWithDistance = function(type, call, dist, distUnit = 'km', include = true) {
    if (include) {
        if (this.incTypeDists)
            this.incTypeDists.push(type + '/' + call + '/' + ((distUnit == 'mi') ? milesToKm(dist) : dist));
        else
            this.incTypeDists = [ type + '/' + call + '/' + ((distUnit == 'mi') ? milesToKm(dist) : dist) ];
    }
    else {
        if (this.excTypeDists)
            this.excTypeDists.push(type + '/' + call + '/' + ((distUnit == 'mi') ? milesToKm(dist) : dist));
        else
            this.excTypeDists = [ type + '/' + call + '/' + ((distUnit == 'mi') ? milesToKm(dist) : dist) ];
    }
};

Filter.prototype.symbol = function(primary, alternate = '', overlay = '', include = true) {
    if (include) {
        if (this.incSymbols)
            this.incSymbols.push(sanitizeObject(primary) + '/' + sanitizeObject(alternate) + '/' + sanitizeObject(overlay));
        else
            this.incSymbols = [ sanitizeObject(primary) + '/' + sanitizeObject(alternate) + '/' + sanitizeObject(overlay) ];
    }
    else {
        if (this.excSymbols)
            this.excSymbols.push(sanitizeObject(primary) + '/' + sanitizeObject(alternate) + '/' + sanitizeObject(overlay));
        else
            this.excSymbols = [ sanitizeObject(primary) + '/' + sanitizeObject(alternate) + '/' + sanitizeObject(overlay) ];
    }
};

Filter.prototype.digipeater= function(digi, include = true) {
    if (include) {
        this.incDigi = checkAndAdd(digi, this.incDigi, '/');
    }
    else {
        this.excDigi = checkAndAdd(digi, this.excDigi, '/');
    }
};

Filter.prototype.area= function(latN, lonW, latS, lonE, include = true) {
    if (include) {
        if (this.incAreas)
            this.incAreas.push(latN + '/' + lonW + '/' + latS + '/' + lonE);
        else
            this.incAreas = [ latN + '/' + lonW + '/' + latS + '/' + lonE ];
    }
    else {
        if (this.excAreas)
            this.excAreas.push(latN + '/' + lonW + '/' + latS + '/' + lonE);
        else
            this.excAreas = [ latN + '/' + lonW + '/' + latS + '/' + lonE ];
    }
};

Filter.prototype.entryStation= function(callsign, include = true) {
    if (include) {
        this.incEntry = checkAndAdd(callsign, this.incEntry, '/');
    }
    else {
        this.excEntry = checkAndAdd(callsign, this.excEntry, '/');
    }
};

Filter.prototype.group= function(callsign, include = true) {
    if (include) {
        this.incGroup = checkAndAdd(callsign, this.incGroup, '/');
    }
    else {
        this.excGroup = checkAndAdd(callsign, this.excGroup, '/');
    }
};

Filter.prototype.unpronto= function(callsign, include = true) {
    if (include) {
        this.incUnpronto = checkAndAdd(callsign, this.incUnpronto, '/');
    }
    else {
        this.excUnpronto = checkAndAdd(callsign, this.excUnpronto, '/');
    }
};

// igates is a boolean to pass positions from IGATES identified by qAr, qAo, or qAR
Filter.prototype.qConstruct= function(constructs, igates = false, include = true) {
    if (include) {
        if (this.incQCons)
            this.incQCons.push(constructs + (igates ? '/I' : ''));
        else
            this.incQCons = [ constructs + (igates ? '/I' : '') ];
    }
    else {
        if (this.excQCons)
            this.excQCons.push(constructs + (igates ? '/I' : ''));
        else
            this.excQCons = [ constructs + (igates ? '/I' : '') ];
    }
};

//Only makes sense to have one of these defined, so we'll overwrite instead of append if we set it when it exists
Filter.prototype.myRange= function(dist, distUnit = 'km', include = true) {
    if (include) {
        this.incMyRange = (distUnit == 'mi') ? milesToKm(dist) : dist;
    }
    else {
        this.excMyRange = (distUnit == 'mi') ? milesToKm(dist) : dist;
    }
};

Filter.prototype.friendRange= function(callsign, dist, distUnit = 'km', include = true) {
    if (include) {
        if (this.incFriendRanges)
            this.incFriendRanges.push(callsign + '/' + ((distUnit == 'mi') ? milesToKm(dist) : dist));
        else
            this.incFriendRanges = [ callsign + '/' + ((distUnit == 'mi') ? milesToKm(dist) : dist) ];
    }
    else {
        if (this.excFriendRanges)
            this.excFriendRanges.push(callsign + '/' + ((distUnit == 'mi') ? milesToKm(dist) : dist));
        else
            this.excFriendRanges = [ callsign + '/' + ((distUnit == 'mi') ? milesToKm(dist) : dist) ];
    }
};

Filter.prototype.toString = function () {
    let filter = '';

    filter += addArrayToFilter(this.incRanges, this.excRanges, 'r');
    filter += addToFilter(this.incPrefix, this.excPrefix, 'p');
    filter += addToFilter(this.incBud, this.excBud, 'b');
    filter += addToFilter(this.incObj, this.excobj, 'o');
    filter += addToFilter(this.incType, this.excType, 't');
    filter += addArrayToFilter(this.incTypeDists, this.excTypeDists, 't');
    filter += addToFilter(this.incSymbols, this.excSymbols, 's');
    filter += addToFilter(this.incDigi, this.excDigi, 'd');
    filter += addArrayToFilter(this.incAreas, this.excAreas, 'a');
    filter += addToFilter(this.incEntry, this.excEntry, 'e');
    filter += addToFilter(this.incGroup, this.excGroup, 'g');
    filter += addToFilter(this.incUnpronto, this.excUnpronto, 'u');
    filter += addArrayToFilter(this.incQCons, this.excQCons, 'q');
    filter += addToFilter(this.incMyRange, this.excMyRange, 'm');
    filter += addArrayToFilter(this.incFriendRanges, this.excFriendRanges, 'f');

    //Strict object filter has to be the last filter. Only one is allowed. If both are set, using the include filter
    if (this.incStrict)
        filter += ' os/' + this.incStrict;
    else if (this.excStrict)
        filter += ' -os/' + this.excStrict;

    if (filter.length > 0)
        return 'filter' + filter;
    else
        return '';
};

function milesToKm(miles) {
    return miles * 1.609344;
}

function sanitizeObject(input) {
    return input.split('/').join('|').split('*').join('~');
}

function checkAndAdd(item, existing, delimiter) {
    if (existing)
        return existing + delimiter + item;
    else
        return item;
}

function addToFilter(included, excluded, prefix) {
    let rtn = '';
    if (included)
        rtn += ' ' + prefix + '/' + included;
    if (excluded)
        rtn += ' -' + prefix + '/' + excluded;
    return rtn;
}

function addArrayToFilter(included, excluded, prefix) {
    let rtn = '';
    if (included) {
        for (const i of included)
            rtn += ' ' + prefix + '/' + i;
    }
    if (excluded) {
        for (const i of excluded)
            rtn += ' -' + prefix + '/' + i;
    }
    return rtn;
}

module.exports = Filter;