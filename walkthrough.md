# Walkthrough – Node.js + Express + EJS Restructure

## What Was Done

Converted the flat static-HTML project into a proper server-side Node.js application.

## Final Folder Structure

```
krushikendra/
├── server.js              ← Express entry point (PORT 3000)
├── package.json           ← express, ejs, dotenv, nodemon
├── .env                   ← PORT=3000 (+ DB placeholder)
├── .gitignore
│
├── public/                ← Static assets (Express serves these)
│   ├── css/style.css
│   ├── js/main.js
│   └── js/products.js
│
├── views/                 ← EJS templates
│   ├── partials/
│   │   ├── head.ejs       ← shared <head> tag
│   │   ├── navbar.ejs     ← shared nav (active page highlighted)
│   │   └── footer.ejs     ← shared footer with dynamic year
│   ├── index.ejs
│   ├── products.ejs
│   ├── dealers.ejs
│   ├── enquiry.ejs
│   ├── become-dealer.ejs
│   ├── product-detail.ejs
│   ├── admin.ejs
│   └── 404.ejs
│
├── routes/
│   ├── index.js           ← GET /
│   ├── products.js        ← GET /products, GET /products/:slug
│   ├── dealers.js         ← GET /dealers
│   ├── enquiry.js         ← GET /enquiry, POST /enquiry
│   ├── dealer-application.js ← GET /become-dealer, POST /become-dealer
│   └── admin.js           ← GET /admin
│
├── data/
│   └── products.js        ← Mock product data (swap for DB later)
│
└── middleware/
    └── logger.js          ← HTTP request logger
```

## How to Run

```bash
# Install dependencies (once)
npm install

# Development (with auto-restart)
npm run dev

# Production
npm start
```

Server runs at **http://localhost:3000**

## Route Verification (all 200 OK)

| Route | View | Server-side features |
|---|---|---|
| `GET /` | [index.ejs](file:///C:/Users/prana/Desktop/krushikendra/views/index.ejs) | Featured products injected from [data/products.js](file:///C:/Users/prana/Desktop/krushikendra/data/products.js) |
| `GET /products` | [products.ejs](file:///C:/Users/prana/Desktop/krushikendra/views/products.ejs) | Filter + search via query params |
| `GET /products/:slug` | [product-detail.ejs](file:///C:/Users/prana/Desktop/krushikendra/views/product-detail.ejs) | Product detail + related products |
| `GET /dealers` | [dealers.ejs](file:///C:/Users/prana/Desktop/krushikendra/views/dealers.ejs) | District filter via query params |
| `GET /enquiry` | [enquiry.ejs](file:///C:/Users/prana/Desktop/krushikendra/views/enquiry.ejs) | Pre-select product via `?product=` |
| `POST /enquiry` | redirect | Server-side validation; logs to console |
| `GET /become-dealer` | [become-dealer.ejs](file:///C:/Users/prana/Desktop/krushikendra/views/become-dealer.ejs) | Application form |
| `POST /become-dealer` | redirect | Server-side validation; logs to console |
| `GET /admin` | [admin.ejs](file:///C:/Users/prana/Desktop/krushikendra/views/admin.ejs) | Stats + product data injected via JSON |

## What's Ready for Backend Integration

- **POST routes** — `/enquiry` and `/become-dealer` validate server-side and log submissions. Replace `console.log` with DB insert or email send.
- **Data layer** — [data/products.js](file:///C:/Users/prana/Desktop/krushikendra/data/products.js) is already structured like a model. Replace exports with Mongoose/Prisma queries.
- **Admin auth** — [routes/admin.js](file:///C:/Users/prana/Desktop/krushikendra/routes/admin.js) has a commented `requireAuth` middleware placeholder.
- **404 handler** — Custom [views/404.ejs](file:///C:/Users/prana/Desktop/krushikendra/views/404.ejs) page wired in [server.js](file:///C:/Users/prana/Desktop/krushikendra/server.js).

## Screenshots

![Homepage via Express](file:///C:/Users/prana/.gemini/antigravity/brain/963d125e-e279-4b4e-87f4-6bb748dc5ef5/node_home_1774389919663.png)

![Products page via Express](file:///C:/Users/prana/.gemini/antigravity/brain/963d125e-e279-4b4e-87f4-6bb748dc5ef5/node_products_1774389931557.png)

![Enquiry form via Express](file:///C:/Users/prana/.gemini/antigravity/brain/963d125e-e279-4b4e-87f4-6bb748dc5ef5/node_enquiry_1774389942136.png)
