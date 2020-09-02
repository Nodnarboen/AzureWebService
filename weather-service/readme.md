# weather-service-restify

To run this nifty little `weather-service-restify` app, make sure you have a MongoDB instance running somewhere.
If it's not on `localhost`, update `app.js` with the appropriate connection string.

Then run 

    node app.js

There's nothing to see in the browser, but the `weather-express` app will connect to `weather-service-restify`.