# Fake QR Code Detector

Fake QR Code Detector is a full-stack cybersecurity web application that helps users analyze QR-code links before opening them. The app focuses on quishing, which means QR-code phishing, by scoring extracted URLs and saving each scan to a personal history.

## Features

- User registration and login with JWT authentication
- Password hashing with bcryptjs
- Protected scanner, dashboard, and history pages
- Manual URL risk analysis
- Browser-side QR image decoding with jsQR
- Scan history saved in SQLite through Prisma
- Dashboard statistics for total, low, medium, and high-risk scans
- Responsive dark cybersecurity-themed UI
- Friendly error messages for invalid input, failed API requests, missing tokens, and QR decode failures

## Tech Stack

- Frontend: React, Vite, JavaScript, React Router, Axios, jsQR, plain CSS
- Backend: Node.js, Express, JWT, bcryptjs, CORS, dotenv
- Database: SQLite
- ORM: Prisma

## Folder Structure

```text
fake-qr-code-detector/
  backend/
    prisma/
      schema.prisma
      migrations/
    src/
      controllers/
      middleware/
      routes/
      services/
      utils/
      server.js
  frontend/
    src/
      api/
      components/
      pages/
      styles/
      App.jsx
      main.jsx
```

## Environment Variables

Create `backend/.env` from `backend/.env.example`:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="replace-this-with-a-long-random-secret"
JWT_EXPIRES_IN="7d"
PORT=5001
FRONTEND_URL="http://localhost:5173"
```

## Installation

Backend:

```bash
cd "/Users/saadaoukach/Desktop/qr fishing/fake-qr-code-detector/backend"
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
```

Frontend:

```bash
cd "/Users/saadaoukach/Desktop/qr fishing/fake-qr-code-detector/frontend"
npm install
```

## Run The Application

Start the backend:

```bash
cd "/Users/saadaoukach/Desktop/qr fishing/fake-qr-code-detector/backend"
npm run dev
```

Start the frontend in a second terminal:

```bash
cd "/Users/saadaoukach/Desktop/qr fishing/fake-qr-code-detector/frontend"
npm run dev
```

Open:

```text
http://localhost:5173
```

The frontend calls the backend at:

```text
http://localhost:5001
```

## Test Credentials Example

Create a new account from the Register page:

```text
Name: Student User
Email: student@example.com
Password: password123
```

## Sample URLs To Test

```text
https://restaurant-menu.ma
http://secure-pay-parking-login.info
http://paypal-secure-payment-login.xyz/verify-account
http://192.168.1.45/login
https://bit.ly/pay-fees-now
https://university-portal.ma
```

## Full Workflow Test

1. Register a new account.
2. Confirm the app redirects to `/scanner`.
3. Paste one of the sample URLs and click `Analyze URL`.
4. Confirm the risk card shows the URL, score, level, issues, and recommendation.
5. Upload a QR code image containing a URL.
6. Confirm the decoded URL is placed into the input field.
7. Click `Analyze URL` to save the scan.
8. Open `/dashboard` and confirm the counters update.
9. Open `/history` and confirm the saved scan appears in the table.
10. Click `Logout` and confirm protected pages redirect to `/login`.

## API Endpoints

Authentication:

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

Scanning:

```text
POST /api/scan/analyze
GET  /api/scan/history
```

Dashboard:

```text
GET /api/dashboard/stats
```

## Screenshots

Add screenshots here for your report or presentation:

```text
screenshots/home.png
screenshots/scanner.png
screenshots/dashboard.png
screenshots/history.png
```

## Academic Purpose

This project is intended for academic learning and demonstration. It shows how a full-stack application can combine authentication, database persistence, frontend QR decoding, and rule-based cybersecurity analysis to help explain quishing risks. The scoring system is educational and should not be treated as a replacement for professional threat intelligence or enterprise security tools.

## Troubleshooting

If Prisma migration fails on a very new Node.js version, use an LTS Node.js version and rerun:

```bash
npm run prisma:generate
npm run prisma:migrate
```

Recommended Node.js versions are current LTS releases.
