const winston = require('winston');
const expressWinston = require('express-winston');

const errors = require('./errors');

module.exports = {
  printStartup: (dirs) => {
    if (process.env.NODE_ENV === "development") {
      console.log('=== WARNING: DEVELOPMENT CONFIGURATION IS ACTIVE ===');
    }
    console.log('Found: ' + dirs.length + ' recordings.');
    console.log('Dump dirs: '+JSON.stringify(dirs, null, 2));
  },
  checkIfNotAuth: (req, res) => {
    if (!req.session || !req.session.authorized) {
      res.status(401).json(errors.NOT_AUTHORIZED);
      return true;
    }
    return false;
  },
  setupLogging: (app) => {
    app.use(expressWinston.logger({
      transports: [
        new winston.transports.Console()
      ],
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple(),
      ),
      meta: false,
      msg: "HTTP {{req.method}} {{req.url}} {{res.code}}",
      expressFormat: true,
      colorize: true,
      ignoreRoute: function (req, res) { return false; }
    }));
  },
};
