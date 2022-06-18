module.exports = class BaseError extends Error {
  constructor(message) {
    super(message);
  }
};
