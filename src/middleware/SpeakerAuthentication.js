const jwt = require('jsonwebtoken');

exports.SpeakerAuthMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(403).send();
  }

  // Maybe need additional verification??
  try {
    const tokenContent = jwt.verify(token, process.env.JWT_SECRET_ACCESS);
    if (tokenContent) {
      req.authToken = tokenContent;
      return next();
    }
  } catch (error) {
    res.send(403, { error: error.message });
  }
  res.send(500);
};
