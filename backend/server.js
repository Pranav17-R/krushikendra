// ================================================
//  TRISHUL KRUSHI KENDRA – server.js
//  Express application entry point
// ================================================

require('dotenv').config();
const express      = require('express');
const path         = require('path');
const cors         = require('cors');
const connectDB    = require('./config/db');
const logger       = require('./middleware/logger');
const notFound     = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');

// ── Route imports ──────────────────────────────
const indexRouter      = require('./routes/index');
const productsRouter   = require('./routes/products');
const dealersRouter    = require('./routes/dealers');
const enquiryRouter    = require('./routes/enquiry');
const dealerAppRouter  = require('./routes/dealer-application');
const adminRouter      = require('./routes/admin');
const apiRouter        = require('./routes/api/index');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Connect to MongoDB ─────────────────────────
connectDB().then((conn) => {
  if (conn) {
    require('./controllers/api/authApiController').seedDefaultAdmin();
  }
});

// ── View engine (EJS templates live in /frontend/views) ──
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend/views'));

// ── CORS ───────────────────────────────────────
app.use(cors({
  origin:      process.env.CORS_ORIGIN || '*',
  methods:     ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
}));

// ── Static assets (CSS/JS/images live in /frontend/public) ──
app.use(express.static(path.join(__dirname, '../frontend/public')));

// ── Fix MIME types for static files ────────────
app.use((req, res, next) => {
  if (req.path.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css; charset=utf-8');
  } else if (req.path.endsWith('.js')) {
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  }
  next();
});

// ── Body parsing ───────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// ── Request logger ─────────────────────────────
app.use(logger);

// ── REST API (v1) ──────────────────────────────
app.use('/api/v1',        apiRouter);

// ── EJS Page Routes ────────────────────────────
app.use('/',              indexRouter);
app.use('/products',      productsRouter);
app.use('/dealers',       dealersRouter);
app.use('/enquiry',       enquiryRouter);
app.use('/become-dealer', dealerAppRouter);
app.use('/admin',         adminRouter);

// ── 404 & Error handlers ───────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start ──────────────────────────────────────
app.listen(PORT, () => {
  console.log(` Trishul Krushi Kendra running at http://localhost:${PORT}`);
  console.log(`   Environment : ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
