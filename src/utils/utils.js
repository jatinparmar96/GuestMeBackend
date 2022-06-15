const bcrypt = require('bcrypt');

/**
 * Generate a bcrypt hash of given string
 * @param {String} literal
 * @returns {String} hash
 */
exports.generateHash = async (literal) => {
  //10 Rounds is enough for our app
  const salt = await bcrypt.genSalt(10);
  //Generate Password HASH
  const hash = await bcrypt.hash(literal, salt);
  return hash;
};
