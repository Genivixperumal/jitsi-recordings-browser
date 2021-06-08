const err = (message) => {
    return {error: message};
};

module.exports = {
    error: err,
    NOT_AUTHORIZED: err('User is not authorized or the session is expired. Please log in again.'),
    INCORRECT_PASSWORD: err('Password is incorrect for the specified user.'),
    NO_USER_SPECIFIED: err('No user or password was entered.'),
}
