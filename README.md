# JobSwipe

JobSwipe is a modern swipe-based job and internship portal for job seekers, freshers, recruiters, and admins. The project now uses a full-stack split: a polished Next.js frontend talks to a Java Spring Boot REST API backed by PostgreSQL.

## Project Explanation

JobSwipe solves the problem of job-search fatigue and high screen time by replacing long scrolling job lists with a swipe-based personalized discovery system. Job seekers can quickly reject, save, or apply to jobs, while recruiters can post jobs and track applicants.

## Features

- Swipe-based job discovery with smooth Framer Motion gestures
- Reject, save, apply, and undo last swipe actions
- Backend feed filtering by job type, experience level, location, skill, work mode, and active deadline
- Expired jobs hidden from the job seeker feed and marked for recruiters/admins
- JWT authentication with role-aware dashboards for job seekers, recruiters, and admins
- Terms and Conditions acceptance during signup
- Forgot password and reset password flow with development-mode reset token support
- Profile picture upload, GitHub profile link, education details, experience level, and PDF resume upload
- Company profile with company logo upload
- Recruiter job posting with dropdowns for job type, work mode, and experience requirement
- Application tracking with withdraw support and `WITHDRAWN` history status
- Admin dashboard with database record tables for users, profiles, jobs, applications, and swipes
- Seed data with demo accounts, company profiles, and 15 sample jobs across Java, Python, SQL, Salesforce, Data Science, Web Development, Testing, Cloud, UI/UX, and more

## Tech Stack

- Frontend: Next.js, TypeScript, Tailwind CSS, Framer Motion, lucide-react
- Backend: Java 21, Spring Boot, Spring Security, JWT, Spring Data JPA/Hibernate
- Database: PostgreSQL
- Build tools: npm for frontend, Maven for backend
- Development uploads: local backend upload folder

## Prerequisites

- Node.js 20 or newer
- Java 21
- Maven 3.9 or newer
- PostgreSQL 14 or newer, or Docker with Docker Compose

## Folder Structure

```text
frontend/
  app/
  components/
  hooks/
  lib/
  types/

backend/
  src/main/java/com/jobswipe/
    config/
    controller/
    dto/
    entity/
    exception/
    repository/
    security/
    service/
```

## Environment Variables

Create `frontend/.env.local`:

```bash
cd frontend
cp .env.example .env.local
```

Then keep this value:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

Create `backend/.env` from the example:

```bash
cd ../backend
cp .env.example .env
```

Use these values for the local Docker database, or adjust the password for your own PostgreSQL install:

```env
DATABASE_URL=jdbc:postgresql://localhost:5432/jobswipe
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
JWT_SECRET=replace_with_a_long_random_secret_for_demo
UPLOAD_DIR=uploads
FRONTEND_URL=http://localhost:3000
APP_DEV_MODE=true
```

Example files are included at `frontend/.env.example` and `backend/.env.example`.

The backend imports `backend/.env` automatically through Spring Boot config import. You can also set the same values as OS environment variables in CI, Render, Railway, Docker, or your terminal.

## PostgreSQL Setup

### Option 1: Local PostgreSQL With Docker

```bash
cd "C:\Users\arpan\OneDrive\Documents\New project"
docker compose up -d
```

The included `docker-compose.yml` starts PostgreSQL on `localhost:5432` with:

```text
database: jobswipe
username: postgres
password: postgres
```

If you are using an existing PostgreSQL installation instead of Docker, create the database manually:

```bash
createdb -U postgres jobswipe
```

Or from `psql`:

```sql
CREATE DATABASE jobswipe;
```

The backend uses Hibernate `ddl-auto=update` for local demo development and seeds demo records automatically when the database is empty.

Confirm PostgreSQL is reachable before starting the backend:

```bash
psql -h localhost -U postgres -d jobswipe
```

On Windows PowerShell without `psql`, at least confirm the port is open:

```powershell
Test-NetConnection -ComputerName localhost -Port 5432
```

### Option 2: Local PostgreSQL Without Docker

1. Install PostgreSQL 14 or newer.
2. Create a database named `jobswipe`.
3. Set `backend/.env`:

```env
DATABASE_URL=jdbc:postgresql://localhost:5432/jobswipe
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_local_postgres_password
JWT_SECRET=replace_with_a_very_long_random_secret_for_hmac_signing_at_least_32_chars
UPLOAD_DIR=uploads
FRONTEND_URL=http://localhost:3000
APP_DEV_MODE=true
```

### Option 3: Cloud PostgreSQL With Supabase

1. Create a Supabase project and copy the pooled database connection details.
2. In `backend/.env`, use a JDBC URL like this:

```env
DATABASE_URL=jdbc:postgresql://aws-0-your-region.pooler.supabase.com:6543/postgres?sslmode=require&prepareThreshold=0
DATABASE_USERNAME=postgres.your-project-ref
DATABASE_PASSWORD=your_supabase_database_password
JWT_SECRET=replace_with_a_very_long_random_secret_for_hmac_signing_at_least_32_chars
UPLOAD_DIR=uploads
FRONTEND_URL=http://localhost:3000
APP_DEV_MODE=true
```

### Option 4: Cloud PostgreSQL With Neon

1. Create a Neon project and copy the pooled or direct database connection details.
2. In `backend/.env`, use a JDBC URL like this:

```env
DATABASE_URL=jdbc:postgresql://ep-your-project.your-region.aws.neon.tech/neondb?sslmode=require
DATABASE_USERNAME=neondb_owner
DATABASE_PASSWORD=your_neon_database_password
JWT_SECRET=replace_with_a_very_long_random_secret_for_hmac_signing_at_least_32_chars
UPLOAD_DIR=uploads
FRONTEND_URL=http://localhost:3000
APP_DEV_MODE=true
```

Never commit `backend/.env`; it is ignored by Git.

### Development Fallback Without PostgreSQL

For UI demos on machines where PostgreSQL is unavailable, use the H2 fallback profile:

```powershell
cd "C:\Users\arpan\OneDrive\Documents\New project\backend"
$env:SPRING_PROFILES_ACTIVE="dev-fallback"
mvn spring-boot:run
```

This fallback creates `backend/data/jobswipe-dev.mv.db`. It is ignored by Git and should not be used as the final PostgreSQL verification.

## Run Locally

Terminal 1 - backend:

```powershell
cd "C:\Users\arpan\OneDrive\Documents\New project\backend"
mvn spring-boot:run
```

Terminal 2 - frontend:

```powershell
cd "C:\Users\arpan\OneDrive\Documents\New project\frontend"
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The frontend calls the backend at [http://localhost:8080/api](http://localhost:8080/api).

If you prefer running the packaged backend jar:

```bash
cd backend
mvn clean package
java -jar target/jobswipe-backend-1.0.0.jar
```

## Quick Login API Test

After the backend is running, test demo login from PowerShell:

```powershell
$body = @{ email = "jobseeker@jobswipe.dev"; password = "JobSeeker@123" } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/auth/login" -ContentType "application/json" -Body $body
```

Repeat with:

```text
recruiter@jobswipe.dev / Recruiter@123
admin@jobswipe.dev / Admin@123
```

## Verification Commands

```bash
cd backend
mvn clean package
```

```bash
cd frontend
npm install
npm run typecheck
npm run build
```

## Demo Login Credentials

| Role | Email | Password |
| --- | --- | --- |
| Job Seeker | `jobseeker@jobswipe.dev` | `JobSeeker@123` |
| Recruiter | `recruiter@jobswipe.dev` | `Recruiter@123` |
| Admin | `admin@jobswipe.dev` | `Admin@123` |

## API Overview

- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/forgot-password`, `POST /api/auth/reset-password`, `GET /api/auth/me`
- Job seeker: `GET/PUT /api/jobseeker/profile`, `POST /api/jobseeker/profile-picture`, `POST /api/jobseeker/resume`
- Jobs: `GET /api/jobs/feed`, `GET /api/jobs`, `GET /api/jobs/{id}`, `POST /api/jobs`, `PUT /api/jobs/{id}`, `DELETE /api/jobs/{id}?confirm=true`
- Swipes: `POST /api/swipes`, `GET /api/swipes/history`, `POST /api/swipes/undo`
- Applications: `POST /api/applications`, `GET /api/applications/my`, `PUT /api/applications/{id}/withdraw`
- Recruiter: `GET /api/recruiter/dashboard`, `GET/PUT /api/recruiter/company-profile`, `POST /api/recruiter/company-logo`, `GET /api/recruiter/applications`, `PUT /api/recruiter/applications/{id}/status`
- Admin: `GET /api/admin/dashboard`, `GET /api/admin/users`, `GET /api/admin/jobseekers`, `GET /api/admin/recruiters`, `GET /api/admin/jobs`, `GET /api/admin/applications`, `GET /api/admin/swipes`

Job feed filters:

```bash
GET /api/jobs/feed?jobType=FULL_TIME&experienceLevel=FRESHER&location=Remote&skill=Java&workMode=REMOTE&activeOnly=true
```

## Upload Notes

During development, profile pictures, company logos, and resume PDFs are stored in the backend `uploads` folder and served from `/api/uploads/**`. For production, replace `FileStorageService` with cloud storage such as AWS S3, Cloudinary, Azure Blob Storage, or Google Cloud Storage, and keep only public URLs in the database.

## Screenshots

Add screenshots here after running the project:

- Landing page
- Swipe jobs page
- Job seeker dashboard
- Recruiter dashboard
- Admin dashboard

## Deployment Notes

- Deploy the backend with Java 21 and PostgreSQL connection variables configured.
- Use a strong `JWT_SECRET` in production.
- Configure CORS through `FRONTEND_URL`.
- Deploy the frontend separately and set `NEXT_PUBLIC_API_BASE_URL` to the backend API URL.
- Replace local upload storage with managed object storage before production use.

## Future Scope

- Add email delivery through SMTP for password reset links
- Add richer recommendation scoring based on profile skills, saved jobs, and application history
- Add recruiter-company verification
- Add notifications for shortlisted candidates
- Add analytics for recruiter conversion and job seeker engagement
