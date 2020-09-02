var express = require('express');
var router = express.Router();

var config = require('../config/main');

var WeatherService = require('../services/WeatherService');
var ws = new WeatherService(config.weatherserviceUri);
var PreviouslyVisitedStorageService = require("../services/PreviouslyVisitedStorageService");
var previouslyVisitedStorageService = new PreviouslyVisitedStorageService(config.redisHost, config.redisPort, config.redisPass);

/* GET home page. */
router.get('/', function (req, res, next) {
    var viewModel = {
        title: 'Weather station',
        tpl: req.query.tpl || null,
        locations: null,
        locationsError: null
    };

    previouslyVisitedStorageService.loadLocations(function doneCallback(err, locations) {    
        viewModel.locations = locations || null;
        viewModel.locationsError = err || null;
        res.render("index", viewModel); 
    });
});

router.get('/current', function (req, res, next) {

    if (req.query.loc) {
        previouslyVisitedStorageService.addLocation(req.query.loc);
    }

    ws.current(req.query.loc, function(e, r) {
        if(e) return next(e);
        if(r && r.cod != 200) {
            var error =  new Error();
            error.status = r.cod;
            error.message = r.message;
            return next(error);
        }

        res.render('weather', {
            title: 'Weather station',
            data: r,
            loc: req.query.loc,
            tpl: req.query.tpl || null
        });
    });
});

router.get('/forecast', function (req, res, next) {

    if (req.query.loc) {
        previouslyVisitedStorageService.addLocation(req.query.loc);
    }

    ws.forecast(req.query.loc, req.query.days, function(e, r) {
        if(e) return next(e);
        if(r && r.cod != 200) {
            var error =  new Error();
            error.status = r.cod;
            error.message = r.message;
            return next(error);
        }

        res.render('weather', {
            title: 'Weather station',
            data: r,
            forecast: true,
            loc: req.query.loc,
            tpl: req.query.tpl || null
        });
    });
});

router.get('/blogdata', function (req, res, next) {

    if (req.query.loc) {
        previouslyVisitedStorageService.addLocation(req.query.loc);
    }

    ws.current(req.query.loc, function(e, r) {

        if(e) return next(e);
        if(r && r.cod != 200) {
            var error =  new Error();
            error.status = r.cod;
            error.message = r.message;
            return next(error);
        }

        res.render('blogweather', {
            title: 'Weather station',
            data: r,
            loc: req.query.loc,
            tpl: req.query.tpl || null
        });
    });
});

module.exports = router;
