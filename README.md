# 4D Tasker - Full Stack Scalable REST API & Web App

A modern, scalable Task Management application built with Node.js, Express, Prisma, SQLite (easily switchable to Postgres/MongoDB), and React (Vite).

## Features

**Backend:**
- **Authentication:** User Registration & Login with JWT and password hashing (bcryptjs).
- **Role-Based Access Control:** `user` vs `admin` roles. Admins can view all tasks, users can only manage their own.
- **CRUD Operations:** Complete REST API for Tasks.
- **Validation & Security:** Input validation via `express-validator`, security headers via `helmet`, and CORS.
- **API Documentation:** Interactive Swagger UI documentation.
- **Database:** Prisma ORM connected to SQLite (zero-config, immediately runnable). Easily switchable to Postgres or MySQL.

**Frontend:**
- **Modern UI:** Stunning 4D Glassmorphism aesthetic without using Tailwind CSS (pure custom CSS variables and animations).
- **Framework:** React.js powered by Vite for blazing fast performance.
- **Routing:** React Router DOM with protected Private Routes.
- **State & Integration:** Context-free clean state management, integrating securely via Axios interceptors.

## Quick Start (Run Locally)

We've included a handy startup script that handles running both the backend and frontend simultaneously.

1. **Start the Application:**
   Double click the `start.bat` file in the root directory OR run the following in your terminal:
   ```bash
   ./start.bat
   ```

2. **Access the App:**
   - **Frontend UI:** [http://localhost:5173](http://localhost:5173)
   - **Backend API:** [http://localhost:5000](http://localhost:5000)
   - **Swagger API Docs:** [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

## Deploying to Vercel

We have pre-configured `vercel.json` so you can deploy this entire monorepo easily!

1. PUSH your code to GitHub.
2. Go to [Vercel](https://vercel.com/) and create a new project, importing your GitHub repository.
3. Keep the Root Directory as `/` (the root). Vercel will automatically detect `vercel.json`.
4. **IMPORTANT: Database for Production:**
   Vercel Serverless Functions have an ephemeral file system, meaning SQLite (`dev.db`) will reset on every request. To run this in production, you MUST use a cloud database (like Vercel Postgres, Supabase, or Neon):
   - Go to `backend/prisma/schema.prisma` and change `provider = "sqlite"` to `provider = "postgresql"`.
   - In your Vercel Dashboard Settings for the project, add a `DATABASE_URL` environment variable pointing to your cloud database.
   - Run `npx prisma db push` against your cloud database before deploying.

## Manual Setup

If you prefer to start them manually:

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
## Default Accounts to Test
You can register a new account from the UI.
To test admin features, you can create a user, then open a database viewer (like Prisma Studio via `npx prisma studio` in the backend folder) and manually change your role to `admin`.
