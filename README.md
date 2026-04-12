# 🏠 Hostel Management System

A full-stack **Hostel/PG Management System** built with Node.js, Express, MongoDB (backend) and Vite + Vanilla JS (frontend). Features JWT authentication, role-based access control, room management, and a complaint tracking system — all wrapped in a sleek dark-themed glassmorphism UI.

---

## ✨ Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with secure token management
- **Email domain validation** — only `@geu.ac.in` emails allowed
- **Role-based access control** — `Admin` and `Tenant` roles
- Password hashing with `bcryptjs`

### 🏢 Room Management (Admin)
- Add, view, and update hostel rooms
- Track room capacity and real-time occupancy
- Visual occupancy progress bars
- Rent per bed configuration

### 📋 Complaint System
- **Tenants** can file and track complaints
- **Admins** can view all complaints and update status
- Status workflow: `Pending` → `In-Progress` → `Resolved`
- Filter complaints by status

### 🎨 Modern Frontend
- Dark glassmorphism design with purple-to-cyan gradient accents
- Responsive sidebar layout with mobile hamburger menu
- Role-aware dashboard with live statistics
- Toast notifications for all actions
- Smooth animations and micro-interactions

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js, Express.js 5 |
| **Database** | MongoDB + Mongoose |
| **Auth** | JWT (jsonwebtoken) + bcryptjs |
| **Frontend** | Vite, Vanilla JavaScript, CSS |
| **Design** | Glassmorphism, CSS custom properties, Inter font |

---

## 📁 Project Structure

```
hostel-management-system/
├── server.js                 # Express entry point
├── package.json
├── .env                      # Environment variables
│
├── controllers/
│   ├── auth.controllers.js   # Register & Login logic
│   ├── rooms.controllers.js  # Room CRUD operations
│   └── complaints.controllers.js  # Complaint management
│
├── models/
│   ├── users.models.js       # User schema (name, email, role, roomID)
│   ├── rooms.models.js       # Room schema (number, capacity, rent)
│   └── complaints.models.js  # Complaint schema (title, desc, status)
│
├── routes/
│   ├── auth.routes.js        # POST /register, /login
│   ├── rooms.routes.js       # GET/POST /, PUT /:id (Admin only)
│   └── complaints.routes.js  # GET/POST /, PUT /:id
│
├── middleware/
│   ├── auth.middleware.js     # JWT verify + role authorization
│   └── error.middleware.js    # Global error handler
│
├── db/
│   └── db.config.js          # MongoDB connection
│
└── frontend/                 # Vite SPA (separate app)
    ├── index.html
    ├── vite.config.js        # Dev server + API proxy
    └── src/
        ├── main.js           # App bootstrap, layout, toast system
        ├── api.js            # Fetch wrapper with JWT injection
        ├── router.js         # Hash-based SPA router
        ├── store.js          # Auth state (localStorage)
        ├── pages/
        │   ├── login.js      # Login page
        │   ├── register.js   # Registration page
        │   ├── dashboard.js  # Role-aware dashboard
        │   ├── rooms.js      # Room management (Admin)
        │   └── complaints.js # Complaints (both roles)
        └── styles/
            ├── index.css     # Design tokens & resets
            ├── components.css # Buttons, cards, modals, badges
            ├── auth.css      # Login/Register pages
            ├── dashboard.css # Sidebar & layout
            ├── rooms.css     # Room cards & grid
            └── complaints.css # Complaint cards & filters
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ and npm
- **MongoDB** (local or Atlas cloud)

### 1. Clone the Repository

```bash
git clone https://github.com/kartik0905/hostel-management-system.git
cd hostel-management-system
```

### 2. Setup Environment Variables

Create a `.env` file in the root directory:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/hostel-db
JWT_SECRET=your_secret_key_here
```

### 3. Install & Run Backend

```bash
npm install
node server.js
```

The backend will start on **http://localhost:3000**

### 4. Install & Run Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on **http://localhost:5173** and proxy API calls to the backend.

---

## 📡 API Endpoints

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | ✕ | Register a new user |
| `POST` | `/api/auth/login` | ✕ | Login & get JWT token |

**Register body:**
```json
{
  "name": "Kartik Garg",
  "email": "kartik@geu.ac.in",
  "password": "securepass",
  "role": "Tenant",
  "contactNumber": "9876543210",
  "roomID": "optional_room_id"
}
```

### Rooms (Admin only)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/rooms` | Bearer | Get all rooms |
| `POST` | `/api/rooms` | Bearer | Add a new room |
| `PUT` | `/api/rooms/:id` | Bearer | Update a room |

### Complaints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `GET` | `/api/complaints` | Bearer | Both | Get complaints (admin=all, tenant=own) |
| `POST` | `/api/complaints` | Bearer | Tenant | File a new complaint |
| `PUT` | `/api/complaints/:id` | Bearer | Admin | Update complaint status |

**Status values:** `Pending`, `In-Progress`, `Resolved`

---

## 🎯 Usage

1. **Register** with your `@geu.ac.in` email as either Admin or Tenant
2. **Login** to access the dashboard
3. **Admin users** can:
   - View dashboard stats (rooms, beds, complaints)
   - Add and manage rooms
   - Update complaint statuses
4. **Tenant users** can:
   - View their complaint history
   - File new complaints
   - Track complaint resolution progress

---

## 📝 License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).

---

## 👤 Author

**Kartik Garg**  
GitHub: [@kartik0905](https://github.com/kartik0905)
