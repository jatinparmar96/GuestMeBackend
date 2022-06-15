const jwt = require('jsonwebtoken');

exports.SpeakerAuthMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(403).send();
    return;
  }

  /**
   * Maybe need additional verification??
   */
  const tokenContent = jwt.verify(
    token,
    process.env.JWT_SECRET_ACCESS
  );
  if (tokenContent) next();
  else res.send(403);
};
