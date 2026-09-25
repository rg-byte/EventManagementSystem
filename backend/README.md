# Event Management System — Backend

Express + MongoDB (Mongoose) API backing the Admin / Vendor / User portals.
Matches the exact data shapes your React frontend already uses (users, vendors,
memberships, products, orders, guests) — this replaces the in-memory `useState`
arrays in `App.js` with real persisted data and JWT-based auth.

## Folder structure
```
backend/
├── config/db.js            MongoDB connection
├── models/                 Mongoose schemas (User, Vendor, Membership, Product, Order, Guest)
├── middleware/auth.js       JWT verification + role-based access control
├── controllers/authController.js   login / signup logic
├── routes/                 One file per resource (auth, vendors, products, orders, guests, memberships)
├── seed/seed.js             Loads the same demo data your frontend hardcoded (admin/admin123 etc.)
├── server.js                App entry point
└── .env.example              Copy this to .env and fill in real values
```

## 1. Local setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
- `MONGO_URI` — get a free connection string from MongoDB Atlas (Database → Connect → Drivers), or use a local MongoDB install (`mongodb://localhost:27017/eventManagementDB`)
- `JWT_SECRET` — any long random string (e.g. generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- `PORT` — defaults to 5000
- `CLIENT_URL` — `http://localhost:3000` while developing locally

## 2. Seed demo data

```bash
npm run seed
```

This creates the same demo accounts your frontend already advertises on the login screens:
- `admin / admin123`
- `vendor1 / vendor123`
- `user1 / user123`

## 3. Run the server

```bash
npm run dev     # with nodemon, auto-restarts on changes
# or
npm start       # plain node
```

Server runs at `http://localhost:5000`. Test it's alive:
```bash
curl http://localhost:5000/api/health
```

## 4. API endpoints (summary)

| Method | Endpoint | Role | Purpose |
|---|---|---|---|
| POST | `/api/auth/login` | public | Login, returns JWT |
| POST | `/api/auth/signup/user` | public | User signup |
| POST | `/api/auth/signup/vendor` | public | Vendor signup |
| GET | `/api/vendors` | any logged-in | List vendors |
| GET/POST/PUT/DELETE | `/api/products` | vendor/any | Manage & browse products |
| GET/POST | `/api/orders` | user/vendor/admin | Place & view orders (role-filtered) |
| PUT | `/api/orders/:id/status` | user/vendor/admin | Update order status |
| GET/POST/PUT/DELETE | `/api/guests` | user | Manage own guest list |
| GET/POST/PUT | `/api/memberships` | admin | Manage vendor memberships |

All protected routes require a header: `Authorization: Bearer <token>` (token returned from login).

## 5. Connecting your React frontend

Replace the local `useState` calls in `App.js` with API calls. Example for login:

```javascript
// Before (frontend-only):
const user = users.find(u => u.username === uname && u.password === pass && u.role === role);

// After (calling the backend):
const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: uname, password: pass, role }),
});
const data = await res.json();
if (!res.ok) { setErrors({ general: data.message }); return; }
localStorage.setItem("token", data.token);
login(data.user);
```

Every subsequent authenticated request needs the token attached:
```javascript
fetch(`${API_BASE_URL}/api/products`, {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});
```

You don't have to migrate every screen before the interview — even wiring up
**login + one resource (e.g. products)** to hit this real API is enough to
honestly say "the backend is real, here's the working auth flow" if asked.

## 6. Deploying (same pattern as Quick Mart)

1. Push this `backend/` folder to its own GitHub repo (or a `backend/` subfolder in your existing repo)
2. On **Render**: New → Web Service → connect the repo → Build command `npm install` → Start command `npm start`
3. Add the same environment variables from `.env` in Render's dashboard (never commit `.env` itself)
4. Once live, update `CLIENT_URL` to your deployed Vercel frontend URL, and update your frontend's `API_BASE_URL` to the Render backend URL

## What to say in the interview
"I originally built this as a frontend-only prototype using local state to
simulate the three portals. I've since added a real Express + MongoDB backend
with JWT authentication and role-based access control, matching the same data
model — admin, vendor, and user roles, with proper password hashing and
protected routes on the server side, not just the frontend."
