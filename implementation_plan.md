# MongoDB Backend Layer – Trishul Krushi Kendra

Add a production-ready Mongoose/MongoDB layer to the existing Express+EJS project. The mock data in [data/products.js](file:///c:/Users/prana/Desktop/krushikendra/data/products.js) is preserved as a seed script; all routes will be updated to use real DB queries via controllers.

## Proposed Changes

### Config

#### [NEW] `config/db.js`
Mongoose connection with retry logic, logging, and graceful disconnect on process exit.

---

### Models

#### [NEW] `models/Product.js`
Schema: `name`, `slug` (unique), `category` (enum), `categoryLabel`, `emoji`, `description`, `benefits[]`, `tags[]`, `stock` (enum), `status`, `featured`, timestamps.

#### [NEW] `models/Enquiry.js`
Schema: `name`, `phone`, `village`, `product` (ref), `crop`, `message`, `status` (new/seen/replied), timestamps.

#### [NEW] `models/DealerApplication.js`
Schema: `dealerName`, `phone`, `village`, `district`, `shopName`, `experience`, `message`, `status` (pending/approved/rejected), timestamps.

#### [NEW] `models/Dealer.js`
Schema: `name`, `emoji`, `village`, `district`, `contact`, `since`, `verified`, `areas[]`, `status`.

---

### Controllers

#### [NEW] `controllers/productController.js`
- `listProducts(req, res)` — filter + search from DB, falls back to mock data if DB not ready
- `getProduct(req, res)` — fetch by slug

#### [NEW] `controllers/enquiryController.js`
- `showForm(req, res)` — GET, loads product list for select
- `submitEnquiry(req, res)` — POST, validates, saves to `Enquiry` collection

#### [NEW] `controllers/dealerController.js`
- `listDealers(req, res)` — filter by district
- `showApplication(req, res)` — GET become-dealer form
- `submitApplication(req, res)` — POST, validates, saves to `DealerApplication`

---

### Middleware

#### [NEW] `middleware/errorHandler.js`
Centralized error handler — logs stack, returns 500 page/JSON depending on `Accept` header.

#### [NEW] `middleware/notFound.js`
404 handler for unmatched routes.

#### [MODIFY] [middleware/logger.js](file:///c:/Users/prana/Desktop/krushikendra/middleware/logger.js)
Add request duration (ms) to log output.

---

### Routes (update to use controllers)

#### [MODIFY] [routes/products.js](file:///c:/Users/prana/Desktop/krushikendra/routes/products.js)
Replace inline logic with `productController.listProducts` and `productController.getProduct`.

#### [MODIFY] [routes/enquiry.js](file:///c:/Users/prana/Desktop/krushikendra/routes/enquiry.js)
Replace inline handlers with `enquiryController.showForm` and `enquiryController.submitEnquiry`.

#### [MODIFY] [routes/dealer-application.js](file:///c:/Users/prana/Desktop/krushikendra/routes/dealer-application.js)
Replace inline handlers with `dealerController.showApplication` and `dealerController.submitApplication`.

#### [MODIFY] [routes/dealers.js](file:///c:/Users/prana/Desktop/krushikendra/routes/dealers.js)
Replace with `dealerController.listDealers`.

---

### Seed Script

#### [NEW] `data/seed.js`
One-time script to insert the 12 mock products and 9 mock dealers into MongoDB.  
Run with: `node data/seed.js`

---

### Root Files

#### [MODIFY] [server.js](file:///c:/Users/prana/Desktop/krushikendra/server.js)
- Add `cors` middleware
- Call `connectDB()` from `config/db.js` before starting server
- Use `middleware/notFound.js` and `middleware/errorHandler.js`

#### [MODIFY] [package.json](file:///c:/Users/prana/Desktop/krushikendra/package.json)
Add: `mongoose`, `cors`  
Add script: `"seed": "node data/seed.js"`

#### [MODIFY] [.env](file:///c:/Users/prana/Desktop/krushikendra/.env)
Uncomment and add: `MONGO_URI=mongodb://localhost:27017/krushikendra`

---

## Verification Plan

### Automated – Server Start
```
npm install
node server.js
```
Expected: `🌾 Trishul Krushi Kendra running at http://localhost:3000`  
With MongoDB running: `✅ MongoDB connected`  
Without MongoDB: graceful fallback log, site still loads using mock data

### Manual – Browser
1. `http://localhost:3000` – Home page with featured products
2. `http://localhost:3000/products` – All 12 products visible
3. `http://localhost:3000/enquiry` – Form submits → saved in DB (check via seed + Compass)
4. `http://localhost:3000/become-dealer` – Application → saved in DB
5. `http://localhost:3000/dealers` – Dealer cards appear

### Seed Test
```
node data/seed.js
```
Expected output: `✅ Seeded 12 products and 9 dealers`

### Error Handling
Visit `http://localhost:3000/nonexistent` → 404 page renders correctly
