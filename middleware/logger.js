// ================================================
//  middleware/logger.js – HTTP request logger
// ================================================

const logger = (req, res, next) => {
  const now    = new Date().toLocaleTimeString('en-IN', { hour12: false });
  const method = req.method.padEnd(6);
  const url    = req.originalUrl;
  console.log(`[${now}] ${method} ${url}`);
  next();
};

module.exports = logger;
