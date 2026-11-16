# 🎉 Event Management System

A full-stack **MERN** web application for creating, managing and browsing events, with secure **JWT-based authentication**. The frontend and backend are built as separate apps and deployed independently.

🔗 **Live Demo:** [YOUR_FULL_LIVE_URL](https://event-management-system-blond-gamma.vercel.app/)

---

## ✨ Features

- 🔐 Secure user authentication using **JSON Web Tokens (JWT)**
- 🛡️ Protected routes using custom **Express middleware**
- 📅 Create, view, update and delete events (CRUD)
- 🗄️ Data persistence with **MongoDB**
- 🌐 REST API consumed by a React frontend
- ☁️ Deployed to production (frontend and backend hosted separately)
- [Add any other feature: event registration, search/filter, user roles, etc.]

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, [Tailwind CSS / CSS] |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Authentication | JWT, Express middleware |
| API testing | Postman |
| Deployment | [Vercel / Render, update as applicable] |

---

## 📁 Project Structure

```
EventManagementSystem/
├── backend/     # Express server, routes, controllers, models, middleware
└── frontend/    # React application
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (local instance or MongoDB Atlas)
- Git

### 1. Clone the repository

```bash
git clone https://github.com/rg-byte/EventManagementSystem.git
cd EventManagementSystem
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the server:

```bash
npm start
```

### 3. Set up the frontend

```bash
cd ../frontend
npm install
```

If your frontend needs the API URL, create a `.env` file inside the `frontend` folder:

```env
[VITE_API_URL or REACT_APP_API_URL]=http://localhost:5000
```

Start the app:

```bash
npm run dev    # or: npm start
```

The app will be available at `http://localhost:5173` (Vite) or `http://localhost:3000` (CRA).

---

## 🔑 API Overview

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Log in and receive a JWT | No |
| GET | `/api/events` | Get all events | [Yes/No] |
| POST | `/api/events` | Create an event | Yes |
| PUT | `/api/events/:id` | Update an event | Yes |
| DELETE | `/api/events/:id` | Delete an event | Yes |

> Update the endpoints above to match your actual routes.

---

## 📸 Screenshots

<!-- Add screenshots or a GIF of the app here -->
![Home Page](./screenshots/home.png)
![Dashboard](./screenshots/dashboard.png)

---

## 🔮 Future Improvements

- Role-based access (admin and user)
- Event registration and attendee management
- Email notifications and reminders
- Search, filter and pagination
- Docker support for easier setup

---

## 👤 Author

**Rhythm Garg**

- GitHub: [@rg-byte](https://github.com/rg-byte)
- LinkedIn: [YOUR_LINKEDIN_URL](www.linkedin.com/in/rhythm-garg-b71b21302)

---

⭐ If you found this project helpful, consider giving it a star!
