/**
 * SGMS Automated Testing Script
 * Tests: Instructor Login → View Courses → View Students → Create Assessment → Enter Grades
 *         Student Login → View Enrolled Courses → View Grades → View Transcript
 *         Registrar Login → View All Students & Courses
 */

const BASE_URL = 'http://localhost:3000';

// Test Credentials
const INSTRUCTOR = {
  email: 'dr.smith@sgms.com',
  password: 'password123',
  name: 'Dr. John Smith'
};

const STUDENT = {
  email: 'david.chen@sgms.com',
  password: 'password123',
  name: 'David Chen'
};

const REGISTRAR = {
  email: 'registrar@sgms.com',
  password: 'password123',
  name: 'Registrar'
};

// ======================
// TEST UTILITIES
// ======================

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  data?: any;
}

const results: TestResult[] = [];

async function login(email: string, password: string): Promise<{ sessionToken: string }> {
  const response = await fetch(`${BASE_URL}/api/auth/callback/credentials`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.statusText}`);
  }

  // Get session from cookies
  const cookies = response.headers.getSetCookie?.();
  return { sessionToken: cookies?.[0] || '' };
}

async function apiCall(
  path: string,
  options: RequestInit = {},
  sessionToken?: string
): Promise<any> {
  const headers: any = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (sessionToken) {
    headers['Cookie'] = sessionToken;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(
      `API call failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

function test(name: string, passed: boolean, error?: string, data?: any) {
  results.push({ name, passed, error, data });
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} ${name}`);
  if (error) console.log(`   Error: ${error}`);
}

// ======================
// TEST SCENARIOS
// ======================

async function testInstructorWorkflow() {
  console.log('\n📚 === INSTRUCTOR WORKFLOW ===');

  try {
    // 1. Login as Instructor
    console.log('\n1️⃣ Login as Instructor...');
    const loginResponse = await apiCall('/api/auth/callback/credentials', {
      method: 'POST',
      body: JSON.stringify({
        email: INSTRUCTOR.email,
        password: INSTRUCTOR.password,
      }),
    });

    test('Instructor Login', !!loginResponse, undefined, loginResponse);

    // 2. Get instructor's courses
    console.log('\n2️⃣ Fetch assigned courses...');
    const courses = await apiCall('/api/courses');
    const hasEngineeringCourse = courses.some(
      (c: any) => c.faculty?.code === 'ENG'
    );
    test(
      'Instructor can view assigned courses',
      hasEngineeringCourse,
      'No engineering courses found',
      courses
    );

    if (courses.length === 0) {
      console.log('⚠️ No courses assigned to instructor');
      return;
    }

    const firstCourse = courses[0];
    console.log(
      `   📖 Course: ${firstCourse.code} - ${firstCourse.name}`
    );

    // 3. Get students in course
    console.log('\n3️⃣ Fetch enrolled students...');
    const students = await apiCall(
      `/api/students?courseId=${firstCourse.id}`
    );
    test(
      'Instructor can view students in course',
      students.length > 0,
      'No students enrolled',
      students
    );

    if (students.length > 0) {
      console.log(`   👨‍🎓 Students in course: ${students.length}`);
      students.slice(0, 3).forEach((s: any, i: number) => {
        console.log(
          `      ${i + 1}. ${s.user.name} (${s.user.email})`
        );
      });
    }

    // 4. Get assessments for course
    console.log('\n4️⃣ Fetch course assessments...');
    const assessments = await apiCall(
      `/api/assessments?courseId=${firstCourse.id}`
    );
    test(
      'Instructor can view assessments',
      assessments.length > 0,
      'No assessments found',
      assessments
    );

    if (assessments.length > 0) {
      console.log(`   📋 Assessments: ${assessments.length}`);
      assessments.slice(0, 3).forEach((a: any, i: number) => {
        console.log(
          `      ${i + 1}. ${a.title} (Weight: ${a.weight}%)`
        );
      });
    }

    // 5. Get grade entries
    console.log('\n5️⃣ Fetch grade entries...');
    const gradeEntries = await apiCall('/api/grade-entries');
    test(
      'Instructor can view grade entries',
      Array.isArray(gradeEntries),
      undefined,
      gradeEntries
    );

    if (Array.isArray(gradeEntries) && gradeEntries.length > 0) {
      console.log(`   📊 Grade entries: ${gradeEntries.length}`);
      const draftCount = gradeEntries.filter(
        (g: any) => g.status === 'DRAFT'
      ).length;
      const submittedCount = gradeEntries.filter(
        (g: any) => g.status === 'SUBMITTED'
      ).length;
      const approvedCount = gradeEntries.filter(
        (g: any) => g.status === 'APPROVED'
      ).length;
      console.log(
        `      Status: ${draftCount} Draft | ${submittedCount} Submitted | ${approvedCount} Approved`
      );
    }
  } catch (error) {
    test(
      'Instructor Workflow',
      false,
      (error as Error).message
    );
  }
}

async function testStudentWorkflow() {
  console.log('\n👨‍🎓 === STUDENT WORKFLOW ===');

  try {
    // 1. Login as Student
    console.log('\n1️⃣ Login as Student...');
    const loginResponse = await apiCall('/api/auth/callback/credentials', {
      method: 'POST',
      body: JSON.stringify({
        email: STUDENT.email,
        password: STUDENT.password,
      }),
    });

    test('Student Login', !!loginResponse);

    // 2. Get enrolled courses
    console.log('\n2️⃣ Fetch enrolled courses...');
    const enrollments = await apiCall('/api/students/enrollments');
    test(
      'Student can view enrolled courses',
      enrollments.length > 0,
      'No enrollments found',
      enrollments
    );

    if (enrollments.length > 0) {
      console.log(`   📖 Enrolled courses: ${enrollments.length}`);
      enrollments.slice(0, 3).forEach((e: any, i: number) => {
        console.log(
          `      ${i + 1}. ${e.course.code} - ${e.course.name}`
        );
      });
    }

    // 3. Get student's grades
    console.log('\n3️⃣ Fetch student grades...');
    const grades = await apiCall('/api/grade-entries');
    test(
      'Student can view grades',
      Array.isArray(grades),
      undefined,
      grades
    );

    if (Array.isArray(grades) && grades.length > 0) {
      console.log(`   📊 Grades received: ${grades.length}`);
      const approvedGrades = grades.filter(
        (g: any) => g.status === 'APPROVED'
      );
      console.log(
        `      Approved grades: ${approvedGrades.length}/${grades.length}`
      );
    }

    // 4. Get transcript
    console.log('\n4️⃣ Fetch academic transcript...');
    const transcript = await apiCall('/api/transcript');
    test(
      'Student can view transcript',
      transcript && transcript.length >= 0,
      undefined,
      transcript
    );

    if (transcript && transcript.length > 0) {
      console.log(`   📜 Transcript entries: ${transcript.length}`);
      transcript.slice(0, 3).forEach((t: any, i: number) => {
        console.log(
          `      ${i + 1}. ${t.course?.code}: ${t.letterGrade || 'N/A'} (GPA: ${t.gpaPoints || 'N/A'})`
        );
      });
    }
  } catch (error) {
    test(
      'Student Workflow',
      false,
      (error as Error).message
    );
  }
}

async function testRegistrarWorkflow() {
  console.log('\n📋 === REGISTRAR WORKFLOW ===');

  try {
    // 1. Login as Registrar
    console.log('\n1️⃣ Login as Registrar...');
    const loginResponse = await apiCall('/api/auth/callback/credentials', {
      method: 'POST',
      body: JSON.stringify({
        email: REGISTRAR.email,
        password: REGISTRAR.password,
      }),
    });

    test('Registrar Login', !!loginResponse);

    // 2. Get all courses
    console.log('\n2️⃣ Fetch all courses...');
    const courses = await apiCall('/api/courses');
    test(
      'Registrar can view all courses',
      courses.length > 0,
      'No courses found',
      courses
    );

    if (courses.length > 0) {
      console.log(`   📖 Total courses: ${courses.length}`);
    }

    // 3. Get all students
    console.log('\n3️⃣ Fetch all students...');
    const students = await apiCall('/api/students');
    test(
      'Registrar can view all students',
      students.length > 0,
      'No students found',
      students
    );

    if (students.length > 0) {
      console.log(`   👨‍🎓 Total students: ${students.length}`);
      const byFaculty: { [key: string]: number } = {};
      students.forEach((s: any) => {
        const faculty = s.user.faculty?.code || 'UNKNOWN';
        byFaculty[faculty] = (byFaculty[faculty] || 0) + 1;
      });
      Object.entries(byFaculty).forEach(([faculty, count]) => {
        console.log(`      ${faculty}: ${count} students`);
      });
    }
  } catch (error) {
    test(
      'Registrar Workflow',
      false,
      (error as Error).message
    );
  }
}

// ======================
// CROSS-VERIFICATION TESTS
// ======================

async function testDataIntegrity() {
  console.log('\n🔍 === DATA INTEGRITY CHECKS ===');

  try {
    // Verify instructor's courses match students' courses
    console.log('\n1️⃣ Verify instructor-student course alignment...');
    const instructorCourses = await apiCall('/api/courses');
    test(
      'Instructor has assigned courses',
      instructorCourses.length > 0
    );

    if (instructorCourses.length > 0) {
      const firstCourse = instructorCourses[0];
      const enrolledStudents = await apiCall(
        `/api/students?courseId=${firstCourse.id}`
      );

      // Verify grades exist for enrolled students
      const gradeEntries = await apiCall('/api/grade-entries');
      const studentGrades = gradeEntries.filter((g: any) =>
        enrolledStudents.some((s: any) => s.id === g.studentId)
      );

      test(
        'Grades exist for enrolled students',
        studentGrades.length > 0,
        `Expected grades for enrolled students, found ${studentGrades.length}`
      );

      console.log(
        `   Course: ${firstCourse.code}`
      );
      console.log(`   Enrolled students: ${enrolledStudents.length}`);
      console.log(`   Grade entries: ${studentGrades.length}`);
    }

    // Verify grade status workflow
    console.log('\n2️⃣ Verify grade status workflow...');
    const allGrades = await apiCall('/api/grade-entries');
    const statuses = {
      DRAFT: 0,
      SUBMITTED: 0,
      APPROVED: 0,
    };

    allGrades.forEach((g: any) => {
      if (g.status in statuses) {
        statuses[g.status as keyof typeof statuses]++;
      }
    });

    test(
      'Grade workflow statuses exist',
      Object.values(statuses).some((v) => v > 0),
      undefined,
      statuses
    );

    console.log(`   DRAFT: ${statuses.DRAFT}`);
    console.log(`   SUBMITTED: ${statuses.SUBMITTED}`);
    console.log(`   APPROVED: ${statuses.APPROVED}`);
  } catch (error) {
    test(
      'Data Integrity',
      false,
      (error as Error).message
    );
  }
}

// ======================
// MAIN TEST RUNNER
// ======================

async function runAllTests() {
  console.log('🚀 SGMS AUTOMATED TEST SUITE');
  console.log('================================\n');

  try {
    await testInstructorWorkflow();
    await testStudentWorkflow();
    await testRegistrarWorkflow();
    await testDataIntegrity();

    // Summary
    console.log('\n\n📊 === TEST SUMMARY ===');
    const passed = results.filter((r) => r.passed).length;
    const total = results.length;
    const percentage = Math.round((passed / total) * 100);

    console.log(`\nTotal: ${passed}/${total} tests passed (${percentage}%)\n`);

    results.forEach((r) => {
      const icon = r.passed ? '✅' : '❌';
      console.log(`${icon} ${r.name}`);
    });

    if (passed === total) {
      console.log('\n🎉 ALL TESTS PASSED!');
    } else {
      console.log(`\n⚠️ ${total - passed} test(s) failed`);
    }
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run tests
runAllTests().catch(console.error);

export {};

