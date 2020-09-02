var Redis = require("redis");
var key = "weather_express_previously_visited_locations";

var redisClient;

function PreviouslyVisitedStorageService(redisHost, redisPort, redisPass) {
	this.redisHost = redisHost;
	this.redisPort = redisPort;
	this.redisPass = redisPass;

	client = Redis.createClient({ 
		host: this.redisHost, 
		port: this.redisPort,
		retry_strategy: function (options) {
			if (options.error && options.error.code === 'ECONNREFUSED') {
				// End reconnecting on a specific error and flush all commands with
				// a individual error
				return new Error('The server refused the connection');
			}
			if (options.total_retry_time > 1000 * 60 * 60) {
				// End reconnecting after a specific timeout and flush all commands
				// with a individual error
				return new Error('Retry time exhausted');
			}
			if (options.attempt > 10) {
				// End reconnecting with built in error
				return undefined;
			}
			// reconnect after
			return Math.min(options.attempt * 100, 3000);
		}
	});
	
	client.auth(this.redisPass, function (err) { if (err) throw err; });

	client.on("connect", function() {
		redisClient = client;
	});
}

PreviouslyVisitedStorageService.prototype.loadLocations = function(doneCallback) {
	var self = this;

	if (doneCallback) {
		if (redisClient) {
			redisClient.get(key, function(err, result) {
				if (err) {
					doneCallback(niceRedisError(err, self.redisHost, self.redisPort), null);
				} else {
					try {
						result = JSON.parse(result);
						doneCallback(null, result);
					} catch(e) {
						doneCallback(e, null);
					}
				}
			});
		} else {
			doneCallback(niceRedisError("", self.redisHost, self.redisPort), null)
		}
	} else {
		throw new Error("No callback specified");
	}
};

PreviouslyVisitedStorageService.prototype.addLocation = function(location) {
	if (redisClient) {
		redisClient.get(key, function(err, result) {
			var array;
			if (err) {
				return;
			} else {
				try {
					array = JSON.parse(result) || [];
				} catch(e) {
					array = [];
				}
			}

			array.push(location);
			if (array.length > 25) {
				array = array.slice(array.length - 25);
			}

			redisClient.set(key, JSON.stringify(array));
		});
	}
};

function niceRedisError(err, redisHost, redisPort) {
	return new Error("Unable to connect to Redis at " + redisHost + ":" + redisPort + "\n" + err);
}

module.exports = PreviouslyVisitedStorageService;
