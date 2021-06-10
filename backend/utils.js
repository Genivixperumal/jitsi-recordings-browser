const errors = require('./errors');

module.exports = {
  printStartup: (dirs) => {
    if (process.env.NODE_ENV === "development") {
      console.log('=== WARNING: DEVELOPMENT CONFIGURATION IS USED ===');
    }
    console.log('Initial add: ' + dirs.length + ' recordings.');
  },
  checkIfNotAuth: (req, res) => {
    if (!req.session || !req.session.authorized) {
      console.log("DEBUG: checkIfNotAuth() req.session="+JSON.stringify(req.session));
      res.status(401).json(errors.NOT_AUTHORIZED);
      return true;
    }
    return false;
  },
};
