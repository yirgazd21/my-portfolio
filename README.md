# 🚀 Premium MERN Stack Portfolio

A professional, fully animated portfolio built with the **MERN Stack** (MongoDB, Express, React, Node.js), **Tailwind CSS**, and **Framer Motion**. Features theme-switching, dynamic admin controls, local image uploads, and actual contact form notifications routed via email.

---

## ✨ Key Features

| Feature | Details |
| :--- | :--- |
| **Aesthetic Theme System** | Sleek Glassmorphic dark mode and clean light mode dynamically synced with local storage. |
| **Interactive Animations** | Particle backgrounds, scroll-triggered reveals, page transitions, and smooth hover micro-animations. |
| **Dynamic Skill Badges** | Integrates Remix Icon support with double-sized brand-colored badges (e.g. React cyan, Node green). |
| **Admins Panel Dashboard** | Secure administrative panel `/admin/dashboard` protected by JWT authentication to manage Experience, Projects, Skills, and Reviews. |
| **Admin Accounts CRUD** | Active administrators can edit usernames, emails, passwords, and manage other admin user profiles. |
| **Local File Uploads** | Admins can upload profile pictures directly from local directories using a styled picker interface. |
| **Nodemailer SMTP Contact Form** | Form submissions are saved in MongoDB and automatically dispatched as formatted HTML emails to your inbox. |
| **Verification Auditing** | Public review system where visitors can leave star ratings and comments on each project. |

---

## 📁 Project Structure

```
portfolio/
├── backend/
│   ├── config/         → MongoDB Connection settings
│   ├── controllers/    → Routing endpoints controller handlers
│   ├── middleware/     → JWT authentication guard
│   ├── models/         → Mongoose models (Admin, Project, Skill, Experience, Contact)
│   ├── routes/         → Express routers
│   ├── uploads/        → Local disk file uploads storage
│   ├── seed.js         → Database seeder
│   └── server.js       → Express API runner
│
└── frontend/
    ├── vercel.json     → Single Page Application routing configuration
    └── src/
        ├── components/
        │   ├── admin/      → Experience, Admins dashboard panels
        │   ├── layout/     → Navigation header and auth wrappers
        │   ├── sections/   → Hero, About, Skills, Projects, Contact forms
        │   └── ui/         → Global particles, custom reveals, and page loaders
        ├── context/        → Authentication and Theme settings
        ├── pages/          → Home, ProjectDetail, AdminLogin, AdminDashboard
        └── utils/          → Axios instance resolver helper
```

---

## 🛠 Setup & Installation

### Prerequisites
- Node.js ≥ 18
- MongoDB (Local server or Atlas cloud)

### 1. Install Dependencies

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` in the `backend/` directory to `.env` and fill in the details:
```bash
cd backend
cp .env.example .env
```
Ensure you set your MongoDB URI, JWT secret, and email credentials:
- `MONGO_URI`: MongoDB connection string.
- `JWT_SECRET`: Random hash key.
- `EMAIL_USER` & `EMAIL_PASS`: Sender credentials (such as a Gmail address and its App Password).
- `EMAIL_RECEIVER`: Destination email address (defaulting to `yirgazdofficial@gmail.com`).

### 3. Seed Database (One-time)
Run the seeder to populate the database with default projects, work history, and the default admin user:
```bash
cd backend
npm run seed
```
**Default Credentials:**
- **Email**: `admin@portfolio.dev`
- **Password**: `Admin@1234`

### 4. Run Development Servers
```bash
# Terminal 1: Run Express Server (Port 5000)
cd backend
npm run dev

# Terminal 2: Run Vite Dev Client (Port 5173)
cd frontend
npm run dev
```

---

## 🔑 REST API Endpoints

### Public Endpoints
| Method | Route | Description |
| :--- | :--- | :--- |
| GET | `/api/projects` | Fetch all projects |
| GET | `/api/projects/:id` | Get details for a single project |
| POST | `/api/projects/:id/reviews` | Write a visitor project review |
| GET | `/api/skills` | Fetch skills list |
| GET | `/api/experiences` | Fetch career work/education timeline entries |
| GET | `/api/auth/public-admin` | Retrieve public metadata of the portfolio owner |
| POST | `/api/contact` | Submit contact form (persists details & routes email) |

### Protected Endpoints (JWT Header Required)
| Method | Route | Description |
| :--- | :--- | :--- |
| POST | `/api/auth/login` | Log in and obtain JWT authorization token |
| GET | `/api/auth/me` | Fetch active logged-in administrator metadata |
| GET | `/api/auth/admins` | Fetch list of all registered administrators |
| POST | `/api/auth/admins` | Register a new administrator account |
| PUT | `/api/auth/admins/:id` | Edit profile info, username, or change password |
| DELETE | `/api/auth/admins/:id` | Delete an administrator account (self-deletion blocked) |
| POST | `/api/upload` | Upload a local image asset using file picker |
| POST/PUT/DELETE | `/api/projects/:id` | Manage portfolio projects |
| PATCH | `/api/projects/:id/reviews/:rid/toggle` | Toggle public visibility approval for reviews |
| DELETE | `/api/projects/:id/reviews/:rid` | Remove a project review |
| POST/PUT/DELETE | `/api/skills/:id` | Manage skills list |
| POST/PUT/DELETE | `/api/experiences/:id` | Manage timeline history |

---

## 🚀 Deployed Environments Configuration

This codebase is configured to be hosted on **Render** (backend) and **Vercel** (frontend).

### Render (Backend Service)
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `MONGO_URI`: Production database.
  - `JWT_SECRET`: Random secure string.
  - `CLIENT_URL`: Your Vercel domain URL (e.g. `https://yourdomain.vercel.app`) to authorize CORS requests.
  - `EMAIL_USER`, `EMAIL_PASS`, and `EMAIL_RECEIVER`: Configured App email.

### Vercel (Frontend Service)
- **Framework Preset**: `Vite`
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL`: Your Render backend service URL (e.g. `https://your-backend.onrender.com/api`).
- *Note*: Single Page Application (SPA) path routing is automatically configured via [`vercel.json`](file:///home/yirgazd/Mine/projects/portf/portfolio/frontend/vercel.json) to prevent 404 path reload issues in production.
