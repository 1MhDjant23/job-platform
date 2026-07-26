# 🧩 Smart Job Board

> A modern full-stack job board platform — centralizing job postings, application tracking, company profiles, and email notifications into a single application.

[![Status](https://img.shields.io/badge/status-in%20development-yellow)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()
[![Node](https://img.shields.io/badge/node-%3E%3D20-green)]()
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)]()
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)]()
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)]()

---

## 📖 Table of Contents

- [Context](#-context)
- [Project Goals](#-project-goals)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [User Roles](#-user-roles)
- [Features](#-features)
- [Repository Structure](#-repository-structure)
- [Data Model Overview](#-data-model-overview)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Git Workflow & Collaboration](#-git-workflow--collaboration)
- [Roadmap](#-roadmap)
- [Deliverables](#-deliverables)
- [Team](#-team)
- [License](#-license)

---

## 🎯 Context

Small companies, startups, and tech teams currently juggle several disconnected tools (LinkedIn, Indeed, Glassdoor…) to manage hiring. **Smart Job Board** centralizes these needs into a single modern platform combining:

- Job posting and management
- Real-time application tracking
- Company profiles
- Automated email notifications

## 🎯 Project Goals

- ✅ Enable employers to post and manage job listings
- ✅ Enable job seekers to browse, filter, and apply for positions
- ✅ Real-time application status updates via email notifications
- ✅ Secure authentication with role-based access control (RBAC)
- ✅ A GraphQL API alongside REST for efficient data fetching
- ✅ A production-grade DevOps pipeline from day one

This project also serves as a **technical portfolio piece** for both team members.

---

## 🛠 Tech Stack

| Domain | Technologies |
|---|---|
| **Architecture** | Clean Architecture / Modular NestJS |
| **Frontend** | React 18 + TypeScript + Vite |
| **Backend** | NestJS + TypeScript |
| **API** | REST + GraphQL (Apollo, code-first) |
| **Authentication** | JWT + Passport.js (access + refresh tokens) |
| **Real-time / Queue** | BullMQ + Redis (email queue) |
| **Database** | PostgreSQL |
| **ORM** | Prisma |
| **File Storage** | Multer + Cloudflare R2 |
| **Versioning** | Git + GitHub (feature branch workflow) |
| **Containerization** | Docker + Docker Compose |
| **CI/CD** | GitHub Actions |
| **Documentation** | Swagger / OpenAPI + README |
| **Deployment** | Railway (API) + Vercel (Web) |

---

## 🏗 Architecture

```
                        ┌─────────────────────┐
                        │   Client (React)    │
                        │  Apollo + TanStack   │
                        └──────────┬───────────┘
                                   │ REST / GraphQL
                        ┌──────────▼───────────┐
                        │     NestJS API        │
                        │  Modular / Clean Arch │
                        ├───────────────────────┤
                        │ Auth │ Users │ Jobs   │
                        │ Companies │ Apps      │
                        │ GraphQL Layer (DL)    │
                        └──────┬─────────┬──────┘
                               │         │
                 ┌─────────────▼──┐   ┌──▼───────────────┐
                 │  PostgreSQL     │   │  Redis + BullMQ  │
                 │  (via Prisma)   │   │  (email queue)   │
                 └─────────────────┘   └──────────────────┘
                                              │
                                       ┌──────▼───────┐
                                       │  Nodemailer  │
                                       │  (SMTP)      │
                                       └──────────────┘

                 ┌──────────────────────────┐
                 │  Cloudflare R2 (files)    │
                 │  Resumes, logos, avatars  │
                 └──────────────────────────┘
```

**Key principles:**
- Strict layer separation (controllers → services → repositories via Prisma)
- DataLoader on the GraphQL side to avoid N+1 query issues
- Asynchronous queues for all email processing (non-blocking)
- Two separate repositories (`job-board-api`, `job-board-web`) for full decoupling

---

## 👥 User Roles

| Role | Icon | Description |
|---|---|---|
| **Admin** | 👑 | Global administration: manage accounts, approve/suspend companies, delete listings, view stats, manage platform config |
| **Employer** | 🏢 | Create company profile, post/manage job listings, manage applicants, update application statuses |
| **Job Seeker** | 👤 | Candidate profile, apply with resume/cover letter, track status, saved jobs, alerts |
| **Public** | 🌐 | Read-only access: browse/filter listings, view job and company detail pages |

---

## ⚙️ Features

### Backend (NestJS)

- **Auth module**: register, login, refresh token, JWT guard, RolesGuard
- **Users module**: profile management, avatar upload
- **Companies module**: CRUD, logo upload
- **Jobs module**: CRUD, advanced filtering, pagination, tags
- **Applications module**: apply, withdraw, status updates, resume upload
- **GraphQL layer**: `JobResolver` + `UserResolver` with DataLoader (no N+1)
- **Email queue**: BullMQ + Redis + Nodemailer (application received, status change, daily digest)
- **Cron jobs**: auto-close expired listings, saved-search digest
- **Swagger**: full documentation at `/api/docs`
- **Security**: rate limiting, Helmet, CORS, health checks
- **DevOps**: Docker Compose (api + postgres + redis), GitHub Actions CI/CD, Railway deployment

### Frontend (React)

- Public job listing page: search, filters, pagination
- Job detail page + apply flow (resume upload modal)
- Auth pages: register/login with role selection
- Job seeker dashboard: my applications, saved jobs, notifications
- Employer dashboard: post job, manage listings, applicant list, status updates
- Company profile page
- Admin panel: users list, companies list, stats overview
- Apollo Client (GraphQL) + TanStack Query (REST)
- React Hook Form + Zod for all forms
- Responsive design with TailwindCSS
- Vercel deployment with environment-based API URL

---

## 📂 Repository Structure

```
job-board-api/
├── src/
│   ├── auth/
│   ├── users/
│   ├── companies/
│   ├── jobs/
│   ├── applications/
│   ├── graphql/
│   │   ├── resolvers/
│   │   └── dataloaders/
│   ├── queue/
│   │   └── email/
│   ├── common/
│   │   ├── guards/
│   │   ├── decorators/
│   │   └── filters/
│   └── main.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── docker-compose.yml
├── Dockerfile
├── .github/workflows/ci.yml
└── README.md

job-board-web/
├── src/
│   ├── pages/
│   ├── components/
│   ├── features/
│   │   ├── jobs/
│   │   ├── applications/
│   │   ├── auth/
│   │   └── admin/
│   ├── graphql/
│   ├── lib/
│   │   ├── apolloClient.ts
│   │   └── queryClient.ts
│   ├── hooks/
│   └── App.tsx
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

---

## 🗄 Data Model Overview

```
User (id, email, password, role, createdAt)
 └── Profile (avatar, bio, resumeUrl)

Company (id, name, logoUrl, description, ownerId → User)

Job (id, title, description, tags[], location, status, companyId → Company, closesAt)

Application (id, status[pending|reviewed|accepted|rejected], resumeUrl, coverLetter, jobId → Job, userId → User)

SavedJob (id, userId → User, jobId → Job)
SavedSearch (id, userId → User, filters JSON)
```

> The detailed schema will be defined via **Prisma** (`prisma/schema.prisma`) in Phase 1.

---

## 🚀 Installation & Setup

### Prerequisites

- Node.js ≥ 20
- Docker & Docker Compose
- pnpm (recommended) or npm/yarn

### Backend (`job-board-api`)

```bash
git clone https://github.com/<org>/job-board-api.git
cd job-board-api
cp .env.example .env
pnpm install

# Start PostgreSQL + Redis via Docker
docker compose up -d postgres redis

# Run Prisma migrations
pnpm prisma migrate dev

# Start the API in dev mode
pnpm start:dev
```

API available at `http://localhost:3000`
Swagger docs: `http://localhost:3000/api/docs`
GraphQL Playground: `http://localhost:3000/graphql`

### Frontend (`job-board-web`)

```bash
git clone https://github.com/<org>/job-board-web.git
cd job-board-web
cp .env.example .env
pnpm install
pnpm dev
```

Frontend available at `http://localhost:5173`

### Run the full stack with Docker Compose

```bash
docker compose up --build
```

---

## 🔐 Environment Variables

**API (`.env`)**

```env
DATABASE_URL=postgresql://user:password@localhost:5432/jobboard
REDIS_URL=redis://localhost:6379
JWT_ACCESS_SECRET=change_me
JWT_REFRESH_SECRET=change_me
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_pass
CLOUDFLARE_R2_BUCKET=job-board-uploads
CLOUDFLARE_R2_ACCESS_KEY=xxx
CLOUDFLARE_R2_SECRET_KEY=xxx
PORT=3000
```

**Web (`.env`)**

```env
VITE_API_URL=http://localhost:3000
VITE_GRAPHQL_URL=http://localhost:3000/graphql
```

---

## 📑 API Documentation

- **Swagger UI**: `/api/docs` — source of truth for all REST endpoints
- **GraphQL Playground**: `/graphql` — introspectable schema, documented queries/mutations
- Any breaking change to a response shape must be discussed before implementation (see collaboration rules)

---

## 🔀 Git Workflow & Collaboration

**Repositories**: two separate repos — `job-board-api` (Mohamed) and `job-board-web` (Samira)

**Branch strategy**
```
main → dev → feature/<feature-name>
```
- ❌ No direct pushes to `main` or `dev`
- ✅ All changes go through a Pull Request
- ✅ Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`

**API contract**
- Swagger UI (`/api/docs`) is the source of truth for all endpoints
- Frontend mocks API responses locally during backend development to stay unblocked
- API contract review meetings at the end of Week 2 and Week 4

**Communication**
- Daily async standup: what I did / what I'm doing / any blockers
- Weekly sync call to align on the next sprint
- Tasks tracked in Notion / Linear — no undocumented work

---

## 🗺 Roadmap

| Phase | Content | Duration |
|---|---|---|
| **Phase 1 — Foundation** | Scaffolding, config, Prisma schema, auth, layout shell | Weeks 1–2 |
| **Phase 2 — Core Features** | Jobs, applications, companies, employer dashboard | Weeks 3–4 |
| **Phase 3 — GraphQL & Async** | GraphQL layer, BullMQ email queue, cron jobs, saved jobs | Weeks 5–6 |
| **Phase 4 — DevOps & QA** | Testing, QA, README, live deployment | Weeks 7–8 |

---

## 📦 Deliverables

| Deliverable | Owner |
|---|---|
| REST + GraphQL API (NestJS) | Mohamed |
| PostgreSQL schema + Prisma migrations | Mohamed |
| Email notification system (BullMQ) | Mohamed |
| Swagger / OpenAPI documentation | Mohamed |
| Docker Compose + GitHub Actions pipeline | Mohamed |
| React frontend (all pages) | Samira |
| Responsive UI with TailwindCSS | Samira |
| Apollo Client + TanStack Query integration | Samira |
| Form validation (React Hook Form + Zod) | Samira |
| API contract review + QA testing | Both |
| README (API repo + Web repo) | Both |
| Architecture diagram | Mohamed |
| Live demo deployment | Both |

---

## 👨‍💻 Team

| Member | Role |
|---|---|
| **Mohamed Ait Tajante** | Backend Developer • DevOps Engineer |
| **Samira Aboutarik** | Frontend Developer • UI/UX Designer |

---

## 📄 License

This project is licensed under the **MIT License** — see the `LICENSE` file for details.

---

<p align="center">
  <sub>Smart Job Board • Technical Specifications • 2026</sub>
</p>
