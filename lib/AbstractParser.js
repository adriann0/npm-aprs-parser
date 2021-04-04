function AbstractParser() {
    if (this.constructor === AbstractParser) {
        throw new Error('Can\'t instantiate abstract class!');
    }
}

AbstractParser.prototype.isMatching = function (bodyContent) {
    throw new Error('Abstract method!');
};

AbstractParser.prototype.tryParse = function (bodyContent, aprsMessageHeader) {
    throw new Error('Abstract method!');
};

AbstractParser.prototype.getParserName = function () {
    throw new Error('Abstract method!');
};

module.exports = AbstractParser;