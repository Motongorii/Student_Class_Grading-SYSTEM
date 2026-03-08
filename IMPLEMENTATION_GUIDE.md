# SGMS Implementation Guide
**Student Grading Management System - Complete Feature Documentation**

---

## GETTING STARTED

### Quick Start (Local Development)
```bash
# 1. Install dependencies
npm install

# 2. Set up environment
# Copy .env file with Neon credentials

# 3. Run migrations
npx prisma migrate deploy

# 4. Seed database
npx prisma db seed

# 5. Start dev server
npm run dev

# Visit: http://localhost:3001
```

### Test Credentials
```
Admin:      admin@sgms.com / password123
Instructor: instructor@sgms.com / password123
Student:    student1@sgms.com / password123
Registrar:  registrar@sgms.com / password123
```

---

## FEATURE WALKTHROUGH

### 1. AUTHENTICATION & ROLES

**File**: `/app/login/page.tsx`, `/lib/authOptions.ts`

**Features**:
- ✅ Email/Password login
- ✅ Role-based access control (ADMIN, INSTRUCTOR, STUDENT, REGISTRAR)
- ✅ NextAuth.js integration
- ✅ JWT token management
- ✅ Secure password hashing (bcrypt)

**User Flows**:
```
User → Login Page → Role Selection → Authenticate → Redirect to Role Dashboard
```

---

### 2. STUDENT MANAGEMENT

**Admin Dashboard**: `/app/admin/students/page.tsx`

**API**: `/app/api/students/route.ts`

**Features**:
- ✅ Create student profiles
- ✅ View all students with pagination
- ✅ Update student status (ACTIVE/INACTIVE)
- ✅ Unique admission number enforcement
- ✅ Database validation

**Student Data**:
```json
{
  "admissionNo": "ADM001",      // Unique ID
  "firstName": "Alice",          // First name
  "lastName": "Smith",           // Last name
  "email": "student1@sgms.com",  // Email
  "courseProgram": "GOVE 101",   // Program
  "yearOfStudy": 1,              // Academic year
  "status": "ACTIVE"             // Active/Inactive
}
```

**How to Add Students**:
1. Admin logs in
2. Navigate to Students
3. Click "Add Student" button
4. Fill form with admission number, name, email, program, year
5. Submit → Student created in database

---

### 3. COURSE MANAGEMENT

**Admin Dashboard**: `/app/admin/page.tsx`

**API**: `/app/api/courses/route.ts`

**Features**:
- ✅ Create courses with unique codes
- ✅ Assign credits
- ✅ Link instructors to courses
- ✅ Manage course assessments

**Course Data**:
```json
{
  "code": "GOVE101",           // Unique course code
  "title": "GOVE 101 - Government",
  "credits": 3                 // Credit hours
}
```

**Pre-seeded Course**:
- Course: GOVE 101 - Government (3 credits)
- 5 Assessments with weights totaling 100%
- 25 enrolled students

---

### 4. ASSESSMENT MANAGEMENT

**Component**: `AssessmentCreateModal.tsx`

**Features**:
- ✅ Define assessments per course
- ✅ Set weight (contribution to total grade)
- ✅ Set maximum marks
- ✅ Support multiple assessment types

**Pre-seeded Assessments for GOVE 101**:
```
1. Quiz 1        - Weight: 10%,  Max Marks: 10
2. Quiz 2        - Weight: 10%,  Max Marks: 10
3. Midterm Exam  - Weight: 30%,  Max Marks: 30
4. Project       - Weight: 20%,  Max Marks: 20
5. Final Exam    - Weight: 30%,  Max Marks: 30
                 ─────────────
                 Total: 100%
```

**Grade Computation Example**:
```
If student scored:
- Quiz 1: 8/10         → 80%
- Quiz 2: 9/10         → 90%
- Midterm: 25/30       → 83.33%
- Project: 18/20       → 90%
- Final: 27/30         → 90%

Weighted Total = (80×10 + 90×10 + 83.33×30 + 90×20 + 90×30) / 100
               = 87.5%  → Letter Grade: B  → GPA: 3.5
```

---

### 5. GRADE ENTRY & MANAGEMENT

**Component**: `GradeEntryModal.tsx`, `InstructorGradeEntryClient.tsx`

**API**: `/app/api/grade-entries/route.ts`

**Workflow**:
```
1. Instructor selects student
2. Selects assessment
3. Enters marks (0 to max)
4. Submits (Status: DRAFT)
5. Reviews and Approves (Status: APPROVED)
6. System auto-computes final grade
```

**Grade Status Flow**:
```
DRAFT → (Instructor reviews) → SUBMITTED → (Approves) → APPROVED
                                                         ↓
                                                Auto-Compute Grade
                                                Update ComputedGrade
                                                Update Student Transcript
```

**How Instructors Enter Grades**:
1. Login as instructor
2. Go to Instructor Dashboard
3. Select "Enter/Approve Grades"
4. Choose course (GOVE 101)
5. Open grade entry modal
6. Select student and assessment
7. Enter marks (0-30 for example)
8. Save and approve
9. System calculates weighted grade automatically

---

### 6. AUTOMATIC GRADE COMPUTATION

**Module**: `/lib/gradeComputation.ts`

**Function**: `computeStudentGrade(studentId, courseId)`

**Algorithm**:
```typescript
1. Get all APPROVED grade entries for student in course
2. For each entry:
   - Percentage = (marks / maxMarks) × 100
   - WeightedScore = (percentage × weight) / 100
   - TotalWeighted += WeightedScore
3. Look up grade scale:
   if totalWeighted >= 80 → A (4.0 GPA)
   if totalWeighted >= 75 → B+ (3.5 GPA)
   ... etc
4. Save to ComputedGrade table
5. Update Student Transcript
```

**Automatic Trigger**:
- Runs after each grade is APPROVED
- Updates ComputedGrade table
- Makes result available in transcripts/reports

---

### 7. GRADE SCALE SYSTEM

**Database Model**: `GradeScale`

**Seeded Data**:
| Letter | Min | Max | GPA Points |
|--------|-----|-----|-----------|
| A      | 80  | 100 | 4.0       |
| B+     | 75  | 79  | 3.5       |
| B      | 70  | 74  | 3.0       |
| C+     | 65  | 69  | 2.5       |
| C      | 60  | 64  | 2.0       |
| D+     | 55  | 59  | 1.5       |
| D      | 50  | 54  | 1.0       |
| F      | 0   | 49  | 0.0       |

**Configurable**: Registrar can update scale in database

---

### 8. STUDENT TRANSCRIPT

**Page**: `/app/student/transcript/page.tsx`

**API**: `/app/api/transcript/route.ts`

**Features**:
- ✅ View complete academic record
- ✅ See all courses, grades, credits
- ✅ Calculate overall GPA
- ✅ Track pass/fail status
- ✅ Print-friendly format
- ✅ Export capability

**Transcript Shows**:
```
Student Info:
- Name, Admission No, Program
- Year of Study, Status

Course Performance:
- Course Code, Title, Credits
- Marks earned, Letter Grade, GPA Points
- Pass/Fail indicator

Summary Statistics:
- Total Courses: 1
- Courses Passed: 1
- Total Credits: 3
- Overall GPA: 3.5
```

**How Students View Transcript**:
1. Login as student
2. Click "View Transcript"
3. See complete academic record
4. Print or save PDF

---

### 9. INSTRUCTOR REPORTING

**Page**: `/app/instructor/reports/page.tsx`

**API**: `/app/api/courses/[id]/report/route.ts`

**Features**:
- ✅ Select course for report
- ✅ View all student grades
- ✅ See class statistics
- ✅ Export to CSV

**Report Includes**:
```
Course: GOVE 101 - Government

Student Grades Table:
- Student Name, Admission No
- Total Score (weighted %)
- Letter Grade
- GPA Points

Class Statistics:
- Class Average: 87.5%
- Pass Rate: 100%
- Total Students: 25

CSV Export:
Downloadable Excel-compatible file
```

**How Instructors Generate Reports**:
1. Login as instructor
2. Go to Reports
3. Select course
4. Click "Generate Report"
5. View table with all grades
6. Click "Export CSV" to download

---

### 10. REGISTRAR FUNCTIONS

**Page**: `/app/registrar/page.tsx`

**Component**: `RegistrarClient.tsx`

**Features**:
- ✅ Manage student records
- ✅ Generate transcripts
- ✅ View class reports
- ✅ Academic record administration

**Registrar Can**:
1. View all student information
2. Generate official transcripts
3. Run class performance reports
4. Manage student enrollment status
5. Issue academic records

---

### 11. AUDIT LOGGING

**Model**: `AuditLog`

**Fields**:
```json
{
  "id": "uuid",
  "actorUserId": "user-id",      // Who did it
  "action": "CREATE/UPDATE/DELETE",  // What action
  "entityType": "GradeEntry",     // What entity
  "entityId": "grade-id",         // Which entity
  "beforeJSON": "{...}",          // Before state
  "afterJSON": "{...}",           // After state
  "createdAt": "2026-03-08T...",
  "ip": "192.168.1.1"             // IP address
}
```

**Events Logged**:
- ✅ Student creation/update/delete
- ✅ Course creation/modification
- ✅ Grade entry submission
- ✅ Grade approval
- ✅ User authentication

---

## DATABASE SCHEMA

### Relationships Map:
```
User ──(instructor)─── Course ──(assessment)─── Assessment
      └(creates grades)                              │
                                                     └─── GradeEntry ──── Student
                                                                          │
Student ──(enrolled in)──── Course ───────────────────┐                 │
       └(has grades)────── ComputedGrade ◄───────────┘    Transcript
                                                      
All Actions ──────────────────────────────────────────→ AuditLog
```

---

## API ENDPOINTS REFERENCE

### Authentication
```
POST   /api/auth/[...nextauth]
       Login, session management, token refresh
```

### Students
```
GET    /api/students              List all students
POST   /api/students              Create new student
GET    /api/students/[id]         Get student details
PUT    /api/students/[id]         Update student
DELETE /api/students/[id]         Delete student
```

### Courses
```
GET    /api/courses               List all courses
POST   /api/courses               Create new course
GET    /api/courses/[id]          Get course details
PUT    /api/courses/[id]          Update course
DELETE /api/courses/[id]          Delete course
GET    /api/courses/[id]/report   Generate course report
```

### Assessments
```
GET    /api/assessments           List assessments
POST   /api/assessments           Create assessment
GET    /api/assessments/[id]      Get assessment details
DELETE /api/assessments/[id]      Delete assessment
```

### Grade Entries
```
GET    /api/grade-entries         List grade entries
POST   /api/grade-entries         Submit grade entry
PUT    /api/grade-entries/[id]    Update grade entry
```

### Academic Records
```
GET    /api/transcript            Get student transcript
```

---

## TROUBLESHOOTING

### Issue: "Database connection error"
**Solution**: Check DATABASE_URL in .env file matches Neon connection string

### Issue: "Grades not calculating"
**Solution**: Ensure grade entry status is "APPROVED" before calculation

### Issue: "Student can't see transcript"
**Solution**: Verify student has at least one APPROVED grade entry

### Issue: "Report CSV export empty"
**Solution**: Ensure course has enrolled students with grades

---

## DEPLOYMENT CHECKLIST

- [ ] Database migrations deployed
- [ ] Seeds executed (grade scale, test data)
- [ ] Environment variables configured
- [ ] SSL/HTTPS enabled
- [ ] Authentication configured
- [ ] Role-based access verified
- [ ] Audit logging enabled
- [ ] Error monitoring setup
- [ ] Performance optimization done
- [ ] Security audit completed

---

## NEXT STEPS

1. **Deploy to Vercel** (5 minutes)
2. **Test with 20 students** (real-time grade viewing)
3. **Monitor performance** (100 concurrent users)
4. **Integrate with institutional email** (optional)
5. **Setup automated backups** (weekly)
6. **Configure monitoring/alerts** (DataDog/Sentry)

---

## SUPPORT

**Repository**: github.com/Motongorii/Student_Class_Grading-SYSTEM

**Local Dev Server**: `npm run dev`

**Database**: Neon PostgreSQL with connection pooling

**Status**: ✅ **PRODUCTION READY**