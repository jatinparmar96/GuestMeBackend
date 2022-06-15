const BaseError = require('./BaseError');

module.exports = class AuthenticationRequestError extends BaseError {
  constructor(message) {
    super(message);
    /**@type {import('./ErrorType').ErrorStatusCode} */
    this.statusCode = 404;
  }
};
