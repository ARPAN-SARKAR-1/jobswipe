# JobSwipe

JobSwipe is a modern swipe-based job and internship portal for students and freshers. Instead of showing a long scrolling job board, it presents one relevant job card at a time so students can reject, save, or apply quickly.

## Project Explanation

JobSwipe solves the problem of job-search fatigue and high screen time by replacing long scrolling job lists with a swipe-based personalized discovery system. Students can quickly reject, save, or apply to jobs, while recruiters can post jobs and track applicants.

## Features

- Swipe-based job discovery with smooth Framer Motion card gestures
- Reject, save, apply, and undo last swipe actions
- Progress indicator such as `4 of 20 jobs viewed`
- Student dashboard with profile completion, saved jobs, and application counts
- Saved jobs page with unsave and apply actions
- Application tracker with clean status badges
- Student profile edit form
- Recruiter dashboard for posted jobs and received applications
- Recruiter post-job form with validation
- Admin dashboard with platform stats and simple job moderation
- Role-aware route protection for student, recruiter, and admin pages
- Prisma ORM with seeded demo data
- SQLite local demo database, with PostgreSQL migration notes below

## Tech Stack

- Next.js with TypeScript
- Tailwind CSS
- Framer Motion
- Prisma ORM
- SQLite for local demo
- PostgreSQL-ready schema notes
- bcryptjs for password hashing
- zod for validation
- lucide-react icons

## Installation

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

The default local demo database uses SQLite:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="replace-this-with-a-long-random-secret"
```

## Database Setup

Generate Prisma Client:

```bash
npm run prisma:generate
```

Run the first migration:

```bash
npm run prisma:migrate -- --name init
```

Seed demo users, companies, applications, and 15 sample jobs:

```bash
npm run seed
```

Run the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## PostgreSQL Option

SQLite is enabled by default for easy final-year demo setup. To use PostgreSQL:

1. Create a PostgreSQL database.
2. Change `DATABASE_URL` in `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/jobswipe?schema=public"
```

3. Change the datasource provider in `prisma/schema.prisma` from `sqlite` to `postgresql`.
4. Run:

```bash
npm run prisma:migrate -- --name init
npm run seed
```

The models use string fields for skills and job type so the same schema stays simple across SQLite and PostgreSQL.

## Demo Login Credentials

| Role | Email | Password |
| --- | --- | --- |
| Student | `student@jobswipe.dev` | `Student@123` |
| Recruiter | `recruiter@jobswipe.dev` | `Recruiter@123` |
| Admin | `admin@jobswipe.dev` | `Admin@123` |

## Sample Job Skills Included

The seed data includes jobs covering Java, Python, SQL, Salesforce, Data Science, Web Development, Testing, Cloud, UI/UX, DevOps, Cybersecurity, React Native, and AI prompt evaluation.

## Screenshots

Add screenshots here after running the project:

- Landing page
- Swipe jobs page
- Student dashboard
- Recruiter dashboard
- Admin dashboard

## Useful Commands

```bash
npm run dev
npm run typecheck
npm run lint
npm run prisma:studio
```

## Future Scope

- Add resume file uploads with cloud storage
- Add a recommendation algorithm based on profile skills and saved jobs
- Add recruiter-company verification
- Add email notifications for shortlisted candidates
- Add advanced filters before starting the swipe deck
- Add analytics for student interest and recruiter conversion rates
- Add real-time application updates
