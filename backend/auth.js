const htpasswd = require('htpasswd-js');

module.exports = {
  checkUserPwd : async (user, pwd) => {
    return htpasswd.authenticate({
      username: user,
      password: pwd,
      file: process.env.HTPASSWD_FILE
    });
  }
};
