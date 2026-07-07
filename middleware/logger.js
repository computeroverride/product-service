const crypto = require('crypto');

const requestLogger = (req, res, next) => {
  const requestId = crypto.randomUUID();

  req.requestId = requestId;

  console.log(`[${new Date().toISOString()}] [ID:${requestId}] ${req.method} ${req.url}`);

  res.setHeader('X-Request-Id', requestId);

  next();
};

module.exports = requestLogger;