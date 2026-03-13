# Employee Attendance System (MEAN)

Production-oriented MEAN stack attendance tracker with UTC-safe timestamps, timezone-aware rendering, JWT auth, and geo-fenced check-in/out.

## Folder Structure

- `server/` Express + MongoDB backend
  - `config/` DB connection
  - `controllers/` API handlers
  - `middleware/` auth, validation, error handling
  - `models/` User, Attendance, OfficeConfig schemas
  - `routes/` auth, attendance, admin APIs
  - `services/` token service
  - `utils/` timezone and Haversine utilities
  - `scripts/seed.js` seed admin + office data
- `angular/` Angular Material frontend
  - `auth/` login UI
  - `attendance/` employee dashboard
  - `dashboard/` admin dashboard
  - `services/` API/auth/attendance services
  - `guards/` auth guard
  - `models/` app interfaces

## Installation

### Prerequisites
- Node.js 20+
- MongoDB 7+

### 1) Clone + env

```bash
cp .env.example .env
```

Update `.env` values.

### 2) Run backend

```bash
cd server
npm install
npm run dev
```

### 3) Run frontend

```bash
cd angular
npm install
npm start
```

Backend: `http://localhost:5000`  
Frontend: `http://localhost:4200`


## Common Startup Error

If you see:

```
The `uri` parameter to `openUri()` must be a string, got "undefined"
```

it means `MONGO_URI` is not loaded. Fix with:

```bash
cp .env.example .env
# then edit .env and set MONGO_URI
```

## API Documentation

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Attendance (Employee JWT)
- `POST /api/attendance/checkin`
- `POST /api/attendance/checkout`
- `GET /api/attendance/my?timezone=Asia/Kolkata`

Payload for checkin/checkout:

```json
{
  "latitude": 28.6139,
  "longitude": 77.2090,
  "timezone": "Asia/Kolkata"
}
```

### Admin (Admin JWT)
- `POST /api/admin/createEmployee`
- `PUT /api/admin/office`
- `GET /api/admin/attendance?page=1&limit=20`

## Timezone + UTC Strategy

- All attendance datetimes are persisted in UTC (`checkInUTC`, `checkOutUTC`).
- Client timezone is auto-detected with `Intl.DateTimeFormat().resolvedOptions().timeZone`.
- Localized view is returned with timezone conversion utility.

## Location Validation

- Admin configures `officeLatitude`, `officeLongitude`, `allowedRadiusMeters`.
- Attendance endpoints use Haversine formula and reject requests outside radius.

## Seed Data

```bash
cd server
npm install
npm run seed
```

Creates:
- Admin: `admin@attendance.local` / `Admin@123`
- Default office config (New Delhi + 300m radius)

## Docker (Optional)

```bash
docker compose up --build
```

## Notes

- Rate limiting enabled on `/api`.
- Passwords hashed with bcrypt.
- Role-based access enforced via JWT middleware.
