// ================================================
//  middleware/errorHandler.js – Global error handler
// ================================================

/**
 * Express error-handling middleware (4-arg signature).
 * Catches any error thrown or passed via next(err) in routes/controllers.
 */
const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || err.status || 500;

  // ── Log ─────────────────────────────────────────
  const emoji = statusCode >= 500 ? '❌' : '⚠️';
  console.error(`${emoji}  [${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.error(`   Status: ${statusCode} | Message: ${err.message}`);
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    console.error(err.stack);
  }

  // ── Mongoose validation error ────────────────────
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    if (!req.originalUrl.startsWith('/api/') && req.accepts('html')) {
      return res.status(400).render('404', {
        title:      'Validation Error',
        activePage: '',
        errorMsg:   messages.join(', '),
      });
    }
    return res.status(400).json({ success: false, errors: messages });
  }

  // ── Mongoose duplicate key ───────────────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const msg   = `Duplicate value for ${field}.`;
    if (!req.originalUrl.startsWith('/api/') && req.accepts('html')) {
      return res.status(409).render('404', { title: 'Conflict', activePage: '', errorMsg: msg });
    }
    return res.status(409).json({ success: false, message: msg });
  }

  // ── Generic ─────────────────────────────────────
  if (!req.originalUrl.startsWith('/api/') && req.accepts('html')) {
    return res.status(statusCode).render('404', {
      title:      statusCode === 404 ? 'Page Not Found' : 'Something Went Wrong',
      activePage: '',
      errorMsg:   statusCode < 500 ? err.message : 'An unexpected error occurred. Please try again.',
    });
  }

  return res.status(statusCode).json({
    success: false,
    message: statusCode < 500 ? err.message : 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
