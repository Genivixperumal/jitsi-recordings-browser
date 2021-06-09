const errors = require('./errors');

module.exports = {
  printStartup: (dirs) => {
    if (process.env.NODE_ENV === "development") {
      console.log('=== WARNING: DEVELOPMENT CONFIGURATION IS USED ===');
    }
    console.log('Initial add: ' + dirs.length + ' recordings.');
  },
  checkIfNotAuth: (req, res) => {
    if (!req.session.authorized) {
      res.status(401).json(errors.NOT_AUTHORIZED);
      return true;
    }
    return false;
  },
};
