# MERN E‑Commerce Store — Run & Setup Guide

## 1) Prerequisites
- Node.js 18+ and npm (or Yarn/PNPM)
- MongoDB Atlas account (or local MongoDB)
- A terminal (PowerShell, macOS Terminal, or Linux shell)
- Git (optional)

## 2) Folder layout (top-level)
```
MERN-E-Commerce-Store-main
  - backend
    - config
      - db.js
    - controllers
      - categoryController.js
      - orderController.js
      - productController.js
      - userController.js
    - middlewares
      - asyncHandler.js
      - authMiddleware.js
      - checkId.js
    - models
      - categoryModel.js
      - orderModel.js
      - productModel.js
      - userModel.js
    - routes
      - categoryRoutes.js
      - orderRoutes.js
      - productRoutes.js
      - uploadRoutes.js
      - userRoutes.js
    - utils
      - createToken.js
    - index.js
  - frontend
    - src
      - components
      - pages
      - redux
      - Utils
      - App.jsx
      - index.css
      - main.jsx
    - .eslintrc.cjs
    - .gitignore
    - index.html
    - package-lock.json
    - package.json
    - postcss.config.js
    - README.md
    - tailwind.config.js
    - vite.config.js
  - .env
  - .gitignore
  - example-env.env
  - package-lock.json
  - package.json
  - README.md
  - thumb.png
```

## 3) Install dependencies

### Backend
```bash
cd "/mnt/data/project/MERN-E-Commerce-Store-main"
npm install
```

### Frontend
```bash
cd "/mnt/data/project/MERN-E-Commerce-Store-main/frontend"
npm install
```

## 4) Environment variables (.env)
Create a `.env` file in the backend folder. Typical keys for a MERN e‑commerce project:

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<dbname>?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

If the frontend needs API URL configuration, create a `.env` in the frontend folder (for Vite use `VITE_` prefix):
```
VITE_API_BASE=http://localhost:5000
```

## 5) Running locally

### Backend
Common commands from `/mnt/data/project/MERN-E-Commerce-Store-main/package.json`:
```
- backend: `nodemon backend/index.js`
- frontend: `npm run dev --prefix frontend`
- dev: `concurrently "npm run frontend" "npm run backend`
```

Run the backend:
```bash
cd "/mnt/data/project/MERN-E-Commerce-Store-main"
npm run dev
# or
npm start
```

### Frontend
Common commands from `/mnt/data/project/MERN-E-Commerce-Store-main/frontend/package.json`:
```
- dev: `vite`
- build: `vite build`
- lint: `eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0`
- preview: `vite preview`
```

Run the frontend:
```bash
cd "/mnt/data/project/MERN-E-Commerce-Store-main/frontend"
npm run dev
# or
npm start
```

## 6) Open the app
- Backend API: http://localhost:5000
- Frontend: usually http://localhost:5173 or http://localhost:3000


## 7) Seeding data (if available)
- Look for a `seeder` script or `seed.js` in the backend and run it with `npm run seed` or `node seeder.js`.


## 8) Common issues
- **MongoNetworkError**: Check `MONGO_URI` and IP allowlist in MongoDB Atlas.
- **CORS error**: Make sure `CORS_ORIGIN` matches your frontend URL.
- **JWT invalid**: Ensure `JWT_SECRET` in backend matches any token creation.
- **PORT already in use**: Change `PORT` or stop the conflicting process.


## 9) (Optional) Docker
- If `docker-compose.yml` is present, you can run `docker compose up --build` from the project root.


## Appendix: Found .env samples

### /mnt/data/project/MERN-E-Commerce-Store-main/.env
```
PORT=5000
MONGO_URI='mongodb://127.0.0.1:27017/huxnStore'
NODE_ENV=development
JWT_SECRET=abac12afsdkjladf
PAYPAL_CLIENT_ID=
```


## Appendix: package.json scripts (detected)

### /mnt/data/project/MERN-E-Commerce-Store-main/package.json
```
{
  "backend": "nodemon backend/index.js",
  "frontend": "npm run dev --prefix frontend",
  "dev": "concurrently \"npm run frontend\" \"npm run backend"
}
```

### /mnt/data/project/MERN-E-Commerce-Store-main/frontend/package.json
```
{
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
  "preview": "vite preview"
}
```
