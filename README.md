# SPORTS SCHEDULER

A full-stack web application built for the **WD201 Final Project**. Sports Scheduler enables players and admins to organize, join, manage, and report on sports sessions.

---

## 🚀 Key Features

### Authentication & User Profile Management
- **JWT & bcryptjs** password security.
- **Profile Management (`/profile`)**: All users (Players & Admins) can update their **User Name** and change their **Password**.
- **Role-Based Authorization**: Separate features for `PLAYER` and `ADMIN`.
- **Secure Admin Setup**: Admin account registration key (`adminsecret123`) or default pre-seeded credentials (`admin@sportsscheduler.com` / `admin123`).

### Player Capabilities & Schedule Safety
- **Schedule Conflict Prevention**: Automatically blocks users from creating or joining multiple sessions scheduled on the **same Date and Time** with clear error warnings.
- **Dashboard**: Interactive hero slider and quick action cards.
- **Create Session**: Schedule a game by specifying sport, date, time, venue, and required players.
- **Join Session**: Browse available sessions and join with one click.
- **My Sessions**: Track created and joined sessions grouped by *Upcoming*, *Completed*, and *Cancelled*.
- **Cancel Session**: Session creators can cancel their games by providing a required cancellation reason visible to all joined players.

### Admin Capabilities & Analytics
- **Manage Sports (`/admin/sports`)**: Create new sports. **Clickable sport cards** drill down directly into sessions scheduled for that sport.
- **Reports & Player Analytics (`/admin/reports`)**:
  - Filter sessions by custom date range (`From Date` to `To Date`).
  - View total registered players counter.
  - **Sport Popularity Bar Chart**: Visual representation of sessions and participant slots per sport.
  - **Registered Players & Game Overview**: Expandable list showing every registered user (Name, Email, Role, Joined Date) and the exact sports/sessions they signed up for.

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, React Router DOM, Axios, Lucide React Icons, Custom CSS Design System.
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT (`jsonwebtoken`), `bcryptjs`, `cors`, `dotenv`.

---

## ⚙️ Environment Variables

### Backend (`sports-scheduler/backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/sports-scheduler
JWT_SECRET=supersecretjwtkey_sports_scheduler_2026
ADMIN_SEED_SECRET=adminsecret123
```

### Frontend (`sports-scheduler/frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🔑 Admin Login

* **Email**: `admin@sportsscheduler.com`
* **Password**: `admin123`

*(Or register a new admin at `/signup` with Admin Secret `adminsecret123`)*

---

## 🚦 How to Run the Application

### 1. Start Backend Server
```bash
cd sports-scheduler/backend
npm run dev
```

### 2. Start Frontend Server
```bash
cd sports-scheduler/frontend
npm run dev
```
Open `http://localhost:5173` in your browser.
