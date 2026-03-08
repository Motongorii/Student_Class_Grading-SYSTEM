# Student Grading Management System (SGMS)

A production-ready, full-stack grading management platform for universities and colleges.

## Tech Stack
- Next.js 14+ (App Router, TypeScript)
- Tailwind CSS
- PostgreSQL
- Prisma ORM
- NextAuth (Credentials)
- Zod
- RESTful APIs
- Role-based Access Control (RBAC)
- Audit logs

## Features
- User authentication (NextAuth, bcrypt)
- RBAC: ADMIN, INSTRUCTOR, STUDENT, REGISTRAR
- Student, course, assessment, enrollment, and grade management
- Grade computation and reporting
- Audit logs for all critical actions

## Setup

### 1. Environment Variables
Create a `.env` file in the root with:

```
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/sgms
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### 2. Install Dependencies
```
npm install
```

### 3. Database Setup
```
npx prisma migrate dev --name init
```

### 4. Seed Database
```
npx prisma db seed
```

### 5. Run Development Server
```
npm run dev
```

## Folder Structure
- `/app` - Next.js App Router pages
- `/app/api` - RESTful API route handlers
- `/prisma` - Prisma schema and migrations
- `/lib` - Utility functions (RBAC, validation, etc.)
- `/middleware` - API/page protection
- `/components` - UI components

## Example Users
- Admin: admin@sgms.com / password123
- Registrar: registrar@sgms.com / password123
- Instructor: instructor@sgms.com / password123
- Student: student1@sgms.com / password123
- Student: student3@sgms.com / password123

## Notes
- See SRS for full requirements.
- Audit logs are enabled for all create/update/delete/approval actions.
- Grade scale is configurable in the database.
