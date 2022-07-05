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
/**
 * Check if a given string is a valid url or not
 */
exports.checkUrl = (strValue) => {
  let isUrl;
  try {
    isUrl = new URL(strValue);
  } catch {
    return false;
  }
  return isUrl.protocol === 'http:' || isUrl.protocol === 'https:';
};
