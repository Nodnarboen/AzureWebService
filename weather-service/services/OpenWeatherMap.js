var sa = require('superagent');

function OpenWeatherMap() {

}

OpenWeatherMap.prototype.current = function (loc, done) {
    var url = 'http://api.openweathermap.org/data/2.5/weather?APPID=2d768942057ee6f678510a9be9c97fca&units=metric&q=' + loc;
    sa.get(url)
        .accept('json')
        .end(function (error, res) {
            if (error) return done(error);
            return done(null, res.body);
        });
};

OpenWeatherMap.prototype.forecast = function (loc, cnt, done) {
    var url = 'http://api.openweathermap.org/data/2.5/forecast/daily?APPID=2d768942057ee6f678510a9be9c97fca&units=metric&q=' + loc + '&cnt=' + cnt;
    sa.get(url)
        .accept('json')
        .end(function (error, res) {
            if (error) return done(error);
            return done(null, res.body);
        });
};

module.exports = OpenWeatherMap;