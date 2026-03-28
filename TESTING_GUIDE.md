# 🧪 SGMS Complete Testing & Verification Guide

## Overview
This guide walks through testing the entire workflow:
- **Instructor**: Login → View Courses → Select Course → View Students → Create Assessment → Enter Grades
- **Student**: Login → View Enrollments → View Transcript → Verify Grades Appear
- **Registrar**: Login → View All Students → View All Courses → View Reports

---

## ✅ TEST 1: INSTRUCTOR WORKFLOW

### Step 1: Login as Instructor
1. Open: `http://localhost:3000/login`
2. Click "Instructor Sign In"
3. Enter:
   - **Email**: `dr.smith@sgms.com`
   - **Password**: `password123`
4. Click "Sign In"

**Expected Result**: Redirected to `/instructor` dashboard showing instructor profile and assigned courses

---

### Step 2: View Assigned Courses
**Expected Elements**:
- ✅ Course list showing all courses assigned to Dr. Smith
- ✅ Course details: Code (e.g., MEG101), Name, Faculty (Engineering)
- ✅ Student count per course
- ✅ Action buttons: View Grades, View Students, Manage Assessments

**Example Course Data**:
```
Course: MEG101 - Basic Mechanics
Faculty: Engineering
Students Enrolled: 5
Status: Active
```

**To Verify**:
- Look for 2 Engineering courses (Dr. Smith teaches 2 courses)
- Count shows correct number of enrolled students (should be 5 per course)

---

### Step 3: Select a Course and View Students
1. Click on "MEG101 - Basic Mechanics" course
2. Click "View Students" or "Student List" button

**Expected Elements**:
- ✅ Table showing all students enrolled in the course
- ✅ Student columns: Name, Admission Number, Email, Faculty
- ✅ Student actions: View Grades, Enter Marks

**Example Student Data**:
```
| Name             | Admission # | Email                   | Faculty     | Actions |
|------------------|------------|------------------------|-------------|---------|
| David Chen       | ENG1003    | david.chen@sgms.com    | Engineering | ...     |
| Maria Garcia     | ENG1002    | maria.garcia@sgms.com  | Engineering | ...     |
| (5 students total in course)
```

**Verification**:
- ✅ Students shown are enrolled in Engineering faculty
- ✅ 5 students total
- ✅ Correct admission numbers (ENG1001-ENG1005)

---

### Step 4: View/Create Assessments
1. In course view, click "Manage Assessments" or "View Assessments"

**Expected Elements**:
- ✅ List of assessments for the course
- ✅ Assessment details: Title, Type, Weight (%), Max Marks
- ✅ "Create Assessment" button
- ✅ Edit/Delete options

**Example Assessments**:
```
| Title        | Weight | Max Marks | Status     |
|--------------|--------|-----------|------------|
| Quiz 1       | 15%    | 10        | Active     |
| Assignment 1 | 20%    | 100       | Active     |
| Midterm      | 30%    | 50        | Active     |
| Final Exam   | 35%    | 100       | Active     |
| TOTAL        | 100%   | -         | -          |
```

**To Create New Assessment** (Optional):
1. Click "Create Assessment"
2. Enter:
   - Title: "Quiz 2"
   - Weight: 10%
   - Max Marks: 10
3. Click "Save"
4. Verify it appears in the list

---

### Step 5: Enter Student Grades/Marks
1. In course view, click "Enter Marks" or "Grade Students"
2. View grid with students and assessments

**Expected Layout**:
```
Student Name     | Quiz 1  | Assignment 1 | Midterm | Final | Weighted Average
David Chen       | [blank] | [blank]      | [blank] | [blank] | -
Maria Garcia     | [blank] | [blank]      | [blank] | [blank] | -
Sarah Patel      | [blank] | [blank]      | [blank] | [blank] | -
...
```

**To Enter Grades**:
1. Click on a cell (e.g., David Chen's Quiz 1)
2. Enter a mark (0-10 for Quiz 1)
3. Press Tab or click outside to save
4. Repeat for other assessments

**Expected Result After Entering**:
```
Data: David Chen
Quiz 1: 8/10
Assignment: 85/100
Midterm: 40/50
Final: 75/100

Calculated Weighted Grade:
= (8/10 × 15%) + (85/100 × 20%) + (40/50 × 30%) + (75/100 × 35%)
= 1.2 + 17 + 24 + 26.25
= 68.45 → Grade: C
```

---

### Step 6: Submit/Approve Grades
1. After entering all grades, look for "Submit Grades" or "Approve" button
2. Status workflow: DRAFT → SUBMITTED → APPROVED

**Expected States**:
- ✅ Initial: Grades marked as "DRAFT" (not visible to students)
- ✅ After Submit: "SUBMITTED" (awaiting approval)
- ✅ After Approval: "APPROVED" (visible to students in transcript)

---

## ✅ TEST 2: STUDENT WORKFLOW

### Step 1: Login as Student
1. Open: `http://localhost:3000/login`
2. Click "Student Sign In"
3. Enter:
   - **Email**: `david.chen@sgms.com`
   - **Password**: `password123`
4. Click "Sign In"

**Expected Result**: Redirected to `/student` dashboard showing enrolled courses and grades

---

### Step 2: View Enrolled Courses
**Expected Elements**:
- ✅ List of courses David is enrolled in
- ✅ Course details: Code, Name, Instructor, Faculty
- ✅ Current grade/status (if grades are published)

**Example Course List**:
```
| Course Code | Course Name         | Instructor       | Current Grade |
|-------------|-------------------|------------------|----------------|
| MEG101      | Basic Mechanics    | Dr. John Smith   | C (68.45)      |
| MEG201      | Advanced Mechanics | Dr. John Smith   | -              |
```

**Expected Count**: David should see 2 Engineering courses (being in Engineering faculty)

---

### Step 3: View Own Grades/Transcript
1. Click on a course (e.g., MEG101)
2. View detailed grades for each assessment

**Expected Elements**:
- ✅ Grades breakdown by assessment
- ✅ Marks received for each assignment
- ✅ Weighted contribution to final grade
- ✅ Final grade/GPA for the course

**Example Transcript**:
```
COURSE: MEG101 - Basic Mechanics
Instructor: Dr. John Smith
Semester: Spring 2024

Assessment Breakdown:
│ Quiz 1 (15%)        │ 8/10    │ 1.2 points      │
│ Assignment 1 (20%)  │ 85/100  │ 17 points       │
│ Midterm (30%)       │ 40/50   │ 24 points       │
│ Final Exam (35%)    │ 75/100  │ 26.25 points    │
├─────────────────────┼─────────┼─────────────────┤
│ TOTAL               │         │ 68.45 / 100     │
│ LETTER GRADE        │         │ C               │
│ GPA POINTS          │         │ 2.0             │
```

---

### Step 4: View Full Transcript
1. Click "View Full Transcript" or "My Transcript" menu option
2. View all courses with grades

**Expected Elements**:
- ✅ All courses enrolled (across all semesters)
- ✅ Grade for each course
- ✅ Overall GPA calculation
- ✅ Print button
- ✅ CSV export option

**Example Full Transcript**:
```
STUDENT ACADEMIC TRANSCRIPT
Student: David Chen
Admission #: ENG1003
Faculty: Engineering

COURSES & GRADES:
┌──────────┬─────────────────────┬──────────┬──────┬──────┐
│ Code     │ Course Name         │ Grade    │ GPA  │ Term │
├──────────┼─────────────────────┼──────────┼──────┼──────┤
│ MEG101   │ Basic Mechanics     │ C        │ 2.0  │ Sp24 │
│ MEG201   │ Advanced Mechanics  │ B+       │ 3.3  │ Sp24 │
│ CVG101   │ Surveying           │ A-       │ 3.7  │ Sp24 │
└──────────┴─────────────────────┴──────────┴──────┴──────┘

CUMULATIVE GPA: 3.0 / 4.0
Status: Good Standing
```

---

## ✅ TEST 3: REGISTRAR WORKFLOW

### Step 1: Login as Registrar
1. Open: `http://localhost:3000/login`
2. Select "Registrar Sign In" (if separate button) OR login with:
   - **Email**: `registrar@sgms.com`
   - **Password**: `password123`

**Expected Result**: Redirected to `/registrar` dashboard with system overview

---

### Step 2: View All Courses
1. Navigate to "Courses" section
2. View complete course listing

**Expected Elements**:
- ✅ All 8 courses (2 per faculty × 4 faculties)
- ✅ Course details: Code, Name, Faculty, Instructor, Enrollments
- ✅ Create Course button
- ✅ Edit/Delete options

**Test Data Verification**:
```
Engineering (ENG): 2 courses
├─ MEG101 - Basic Mechanics (Dr. John Smith) - 5 students
└─ MEG201 - Advanced Mechanics (Prof. Michael Johnson) - 5 students

Education (EDU): 2 courses
├─ EDU101 - Intro to Education (Dr. Sarah Williams) - 5 students
└─ EDU201 - Curriculum Design (Prof. Robert Brown) - 5 students

Agriculture (AGR): 2 courses
├─ AGR101 - Crop Science (Dr. James Davis) - 5 students
└─ AGR201 - Animal Husbandry (Prof. Patricia Miller) - 5 students

Computing (CSC): 2 courses
├─ CSC101 - Programming Basics (Dr. Thomas Wilson) - 5 students
└─ CSC201 - Data Structures (Prof. Lisa Taylor) - 5 students

TOTAL: 8 courses, 40 enrollments
```

---

### Step 3: View All Students
1. Navigate to "Students" section
2. View student listing

**Expected Elements**:
- ✅ All 20 students listed
- ✅ Student details: Name, Admission #, Email, Faculty, Status
- ✅ Search/filter by faculty
- ✅ Create Student button

**Test Data Verification**:
```
Engineering: 5 students
├─ alex.johnson@sgms.com       (ENG1001)
├─ maria.garcia@sgms.com       (ENG1002)
├─ david.chen@sgms.com         (ENG1003)
├─ sarah.patel@sgms.com        (ENG1004)
└─ michael.rodriguez@sgms.com  (ENG1005)

Education: 5 students (EDU1001-EDU1005)
Agriculture: 5 students (AGR1001-AGR1005)
Computing: 5 students (CSC1001-CSC1005)
```

---

### Step 4: View Reports & Analytics
1. Navigate to "Reports" section
2. View system statistics

**Expected Reports**:
- ✅ Student enrollment by faculty
- ✅ Course completion status
- ✅ Grade distribution chart
- ✅ GPA statistics
- ✅ Instructor workload

**Example Report**:
```
SYSTEM OVERVIEW:
Total Students: 20
Total Courses: 8
Total Instructors: 8
Total Assessments: 32
Total Grade Entries: 160

By Faculty:
Engineering: 5 students, 2 courses
Education: 5 students, 2 courses
Agriculture: 5 students, 2 courses
Computing: 5 students, 2 courses

Grade Distribution:
A (90-100): 15% | B (80-89): 25% | C (70-79): 35% | D (60-69): 20% | F (<60): 5%

Average GPA: 2.75 / 4.0
```

---

## ✅ TEST 4: DATA INTEGRITY VERIFICATION

### Cross-Check: Instructor Grades → Student Transcript
1. **As Instructor (dr.smith@sgms.com)**:
   - Enter grades for David Chen in MEG101
   - Record the marks

2. **As Student (david.chen@sgms.com)**:
   - View MEG101 course
   - Verify the same grades appear in transcript
   - ✅ Grades match exactly

**Example**:
```
Instructor Enters:
Quiz 1: 8/10
Assignment: 85/100
Midterm: 40/50
Final: 75/100

Student Sees in Transcript:
MEG101 - Basic Mechanics
Quiz 1 (15%): 8/10 → 1.2 points
Assignment (20%): 85/100 → 17 points
Midterm (30%): 40/50 → 24 points
Final (35%): 75/100 → 26.25 points
Weighted Grade: 68.45 → C (GPA: 2.0)
```

---

### Cross-Check: Course Enrollments

1. **As Registrar**:
   - View "Students" → Filter by Faculty: Engineering
   - Count: 5 students
   - View "Courses" → Filter MEG101
   - Enrollment: 5 students

2. **As Student (david.chen@sgms.com)**:
   - View "My Courses"
   - Should see MEG101 and MEG201

3. **As Instructor (dr.smith@sgms.com)**:
   - View "My Courses"
   - MEG101 should show 5 students including David Chen

✅ All views should be consistent

---

## ✅ TEST 5: AUDIT LOG VERIFICATION (Admin Only)

1. Login as Admin:
   - **Email**: `admin@sgms.com`
   - **Password**: `password123`

2. Navigate to "Audit Logs" section
3. View activity history

**Expected Elements**:
- ✅ Grade Entry Created (when instructor enters marks)
- ✅ Grade Entry Submitted (when submitted)
- ✅ Grade Entry Approved (when approved)
- ✅ Assessment Created
- ✅ Student Enrolled
- ✅ Course Created

**Example Log Entry**:
```
[2024-03-28 14:23:45] grade-entry.created
  User: Dr. John Smith (dr.smith@sgms.com)
  Course: MEG101
  Student: David Chen
  Assessment: Quiz 1
  Value: 8 / 10
  Status: DRAFT
```

---

## 📋 TESTING CHECKLIST

### Instructor Tests ✅
- [ ] Can login successfully
- [ ] Dashboard shows assigned courses (2 Engineering courses)
- [ ] Can view students in each course (5 per course)
- [ ] Can view course assessments (4 per course)
- [ ] Can enter grades for students
- [ ] Grades calculate weighted average correctly
- [ ] Can change grade status (DRAFT → SUBMITTED → APPROVED)

### Student Tests ✅
- [ ] Can login successfully
- [ ] Can view enrolled courses (2 courses)
- [ ] Can view approved grades in transcript
- [ ] Grades match instructor's entries
- [ ] Weighted grade calculation is correct
- [ ] GPA appears in transcript
- [ ] Can print/export transcript

### Registrar Tests ✅
- [ ] Can login successfully
- [ ] Can view all 20 students
- [ ] Can view all 8 courses
- [ ] Can view student distribution by faculty (5 per faculty)
- [ ] Can view course assignments by instructor
- [ ] Can export student/course reports

### Data Integrity Tests ✅
- [ ] Instructor grades appear in student transcript
- [ ] Weighted calculation matches: (Quiz1% × weight) + (Assign% × weight) + ...
- [ ] Letter grades assigned correctly (A: 90-100, B: 80-89, etc.)
- [ ] GPA matches letter grade scale
- [ ] Student count matches across views
- [ ] Course assignments are consistent

---

## 🔧 Troubleshooting

### Issue: "Database not found"
**Solution**: Run `npx prisma db seed` to populate database

### Issue: Grades not appearing in student view
**Solution**: Ensure grades status is "APPROVED" (not DRAFT)

### Issue: Students not showing in course
**Solution**: Verify enrollment relationship exists (student should have faculty matching course)

### Issue: Page shows 403 Forbidden
**Solution**: Login again - session may have expired

---

## 📞 Quick Commands

**Seed database**:
```bash
npx prisma db seed
```

**View database in GUI**:
```bash
npx prisma studio
```

**Restart dev server**:
```bash
npm run dev
```

**Check logs**:
- Open browser console (F12)
- Check terminal output where `npm run dev` is running

---

## Expected Final State
After completing all tests:
- ✅ Instructor can manage courses, assessments, and grades
- ✅ Student can view transcript with all grades and GPA
- ✅ Registrar can view complete system overview
- ✅ All data is consistent across views
- ✅ Grade calculations are mathematically accurate
- ✅ Role-based access control works properly
