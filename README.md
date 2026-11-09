# Waste Collection Booking System — Member 3

This is a standalone Member 3 implementation based on the team project guide.

## Responsibilities

- Areas CRUD
- Contact messages (save, list, read/mark read, delete)
- Admin dashboard statistics
- Frontend pages:
  - Home
  - About
  - Contact
  - Admin Dashboard
  - Manage Areas
  - Admin Messages
- Shared components:
  - Navbar
  - Footer
  - ConfirmBox
- Seed script and setup instructions

## Important Integration Note

This package is a standalone starter implementation based on the shared project guide.

When merging into the team's shared repository, coordinate API paths, authentication middleware, database credentials, and route ownership with Members 1 and 2.

The admin endpoints expect a JWT and an `admin` role. Public area listing and contact submission do not require login.

## Requirements

- Node.js 18+
- MySQL 8+
- VS Code

## 1. Database Setup

1. Open MySQL Workbench.
2. Run `server/db/schema.sql`.
3. Copy `server/.env.example` to `server/.env`.
4. Update your MySQL username and password in `server/.env`.

## 2. Backend Setup

Open a terminal inside the `server` folder.

```bash
npm install
npm run seed
npm run dev
```

Backend runs at:

`http://localhost:5000`

## 3. Frontend Setup

Open another terminal inside the `client` folder.

```bash
npm install
npm run dev
```

Open the URL printed by Vite (normally `http://localhost:5173`).

## Demo Accounts

After running the seed script:

| Role | Email | Password |
|---|---|---|
| Admin | admin@eco.com | Admin@123 |
| Collector | rahul@eco.com | Collector@123 |
| Collector | sunil@eco.com | Collector@123 |
| User | riya@eco.com | User@123 |
| User | amit@eco.com | User@123 |
| User | neha@eco.com | User@123 |

These are development demo credentials. Change them before any real deployment.

## API Endpoints Implemented

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/areas` | Public |
| POST | `/api/areas` | Admin |
| PUT | `/api/areas/:id` | Admin |
| DELETE | `/api/areas/:id` | Admin |
| POST | `/api/messages` | Public |
| GET | `/api/messages` | Admin |
| GET | `/api/messages/:id` | Admin (also marks read) |
| PATCH | `/api/messages/:id/read` | Admin |
| DELETE | `/api/messages/:id` | Admin |
| GET | `/api/admin/stats` | Admin |

## Integration Checklist

1. Use the team's shared `schema.sql`; do not create conflicting versions.
2. Replace the included standalone authentication route and middleware with Member 1's authentication implementation when available.
3. Keep the exact API paths agreed in the team guide.
4. Member 2 should confirm booking status values and table names used by dashboard statistics.
5. Never commit `.env` files or real passwords to GitHub.

## Project Structure

- `client/` — React frontend
- `server/` — Express backend
- `server/config/` — Database configuration
- `server/controllers/` — Backend controllers
- `server/db/` — Database schema and seed script
- `server/middleware/` — Authentication middleware
- `server/routes/` — API routes

---

**Project:** Waste Collection Booking System  
**Module:** Member 3