# PeopleDesk — Employee Management System

A MERN starter project with separate React/Vite frontend and Express/MongoDB backend, role-based Admin and Employee dashboards, employee CRUD, and employee self-service profile editing.

## Requirements

- Node.js 18 or newer
- MongoDB local service or MongoDB Atlas database

## 1. Install dependencies

Open two terminals.

### Backend
```bash
cd backend
npm install
```

Copy `backend/.env.example` to `backend/.env` and set your MongoDB URI and a strong JWT secret.

### Frontend
```bash
cd frontend
npm install
```

Copy `frontend/.env.example` to `frontend/.env`.

## 2. Create the first Admin account

Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `backend/.env`. Use a strong password of at least 12 characters.

```bash
cd backend
npm run seed:admin
```

The seed command will not overwrite an existing account. There is intentionally no public Admin registration endpoint.

## 3. Run the project

Terminal 1:
```bash
cd backend
npm run dev
```

Terminal 2:
```bash
cd frontend
npm run dev
```

Open http://localhost:5173 and sign in using the Admin credentials from `backend/.env`.

## API overview

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/employees/stats` (Admin)
- `GET /api/employees` (Admin)
- `POST /api/employees` (Admin)
- `GET /api/employees/:id` (Admin)
- `PUT /api/employees/:id` (Admin)
- `DELETE /api/employees/:id` (Admin)
- `GET /api/employees/me/profile` (Employee)
- `PATCH /api/employees/me/profile` (Employee)
- `POST /api/employees/me/profile-image` (Employee)

## Notes

- Login uses an HTTP-only cookie. Axios sends credentials using `withCredentials: true`.
- Backend role middleware is the real authorization boundary; frontend route guards are for navigation and UX.
- Profile images accept JPEG, PNG, and WebP, up to 2 MB.
- Local uploads are served from `/uploads`. For production, use private object storage or a provider such as Cloudinary, and review access controls before deployment.
- This is a starter implementation. Before production, add rate limiting, CSRF protection appropriate to your cookie setup, audit logging, stronger request schemas, and automated tests. Also review how image files are served if they must be private.
- Employee profile images are currently uploadable by the employee. Admin image upload/edit is not yet included in this starter.
