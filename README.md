# Student Grading Management System (SGMS)

A production-ready, full-stack grading management platform for universities and colleges.

**Status: ✅ FULLY COMPLIANT WITH SRS & SDS SPECIFICATIONS**

## Quick Links
- **[SRS Compliance Report](./SRS_COMPLIANCE_REPORT.md)** - Full requirements verification
- **[Implementation Guide](./IMPLEMENTATION_GUIDE.md)** - Feature documentation and usage
- **[Live Demo](http://localhost:3001)** - Run locally with `npm run dev`

## Tech Stack
- Next.js 14+ (App Router, TypeScript)
- Tailwind CSS
- PostgreSQL (Neon)
- Prisma ORM
- NextAuth (Credentials)
- Zod validation
- RESTful APIs
- Role-based Access Control (RBAC)
- Audit logs

## ✅ Core Features Implemented

### Authentication & Access Control
- ✅ Secure login with NextAuth.js
- ✅ Role-based access (ADMIN, INSTRUCTOR, STUDENT, REGISTRAR)
- ✅ Password encryption with bcrypt
- ✅ JWT session management

### User Management
- ✅ Student registration and profiles
- ✅ Admin user management  
- ✅ Instructor assignment
- ✅ Registrar functions

### Course Management
- ✅ Create and manage courses
- ✅ Assign instructors to courses
- ✅ Define assessments with weights
- ✅ Track enrollments

### Grade Management
- ✅ Enter student marks per assessment
- ✅ Approval workflow (DRAFT → SUBMITTED → APPROVED)
- ✅ **Automatic weighted grade computation**
- ✅ Letter grade assignment (A-F)
- ✅ GPA calculation (0.0-4.0)

### Reporting & Transcripts
- ✅ **Student academic transcripts** with GPA
- ✅ **Instructor course reports** with statistics
- ✅ **CSV export** for reports
- ✅ **Class analytics** (average, pass rate)
- ✅ **Print-friendly** transcript format

### Data & Security
- ✅ PostgreSQL with Neon
- ✅ Prisma ORM with migrations
- ✅ Audit logging of all critical actions
- ✅ Third Normal Form (3NF) database design
- ✅ SQL injection prevention
- ✅ RBAC enforcement

## Database Models

```
✅ User (Authentication)
✅ Student (Student Management)
✅ Course (Course Management)
✅ CourseInstructor (Relationships)
✅ Assessment (Assessment Definition)
✅ Enrollment (Student-Course)
✅ GradeEntry (Individual Grades)
✅ ComputedGrade (Final Grades with GPA)
✅ GradeScale (A-F Mapping)
✅ AuditLog (Compliance Tracking)
```

## Setup

### 1. Environment Variables
Create a `.env` file in the root with:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DATABASE
NEXTAUTH_SECRET=your_random_secret_key
NEXTAUTH_URL=http://localhost:3000
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup
```bash
npx prisma migrate deploy
```

### 4. Seed Database
```bash
npx prisma db seed
```

### 5. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

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
- Instructors:
  - dr.smith@sgms.com / password123 (Dr. John Smith - Mechanical Engineering)
  - prof.johnson@sgms.com / password123 (Prof. Michael Johnson - Civil Engineering)
  - dr.williams@sgms.com / password123 (Dr. Sarah Williams - Psychology & Education)
  - prof.brown@sgms.com / password123 (Prof. Robert Brown - Curriculum & Instruction)
  - dr.davis@sgms.com / password123 (Dr. James Davis - Crop Science)
  - prof.miller@sgms.com / password123 (Prof. Patricia Miller - Animal Science)
  - dr.wilson@sgms.com / password123 (Dr. Thomas Wilson - Software Engineering)
  - prof.taylor@sgms.com / password123 (Prof. Lisa Taylor - Networks & Security)
- Students:
  - Engineering: eng.student1@sgms.com to eng.student5@sgms.com / password123
  - Education: edu.student1@sgms.com to edu.student5@sgms.com / password123
  - Agriculture: agr.student1@sgms.com to agr.student5@sgms.com / password123
  - Computing: csc.student1@sgms.com to csc.student5@sgms.com / password123
  - Each student has unique admission number (ENG1001-ENG1005, EDU1001-EDU1005, AGR1001-AGR1005, CSC1001-CSC1005)

## Notes
- See SRS for full requirements.
- Audit logs are enabled for all create/update/delete/approval actions.
- Grade scale is configurable in the database.
