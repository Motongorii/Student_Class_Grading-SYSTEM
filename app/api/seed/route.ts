import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Check for a secret key to prevent unauthorized access
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const envSecret = process.env.SEED_SECRET;

    // Debug logging
    console.log('Seed API called');
    console.log('Secret from URL:', secret);
    console.log('Secret from ENV:', envSecret ? '***set***' : '***NOT SET***');

    // Check if env var is missing
    if (!envSecret) {
      return NextResponse.json({
        success: false,
        error: 'SEED_SECRET environment variable not set in Vercel dashboard'
      }, { status: 500 });
    }

    // Only allow seeding with a secret key (set this in your environment variables)
    if (secret !== envSecret) {
      return NextResponse.json({
        success: false,
        error: 'Invalid or missing secret. Secrets do not match.',
        hint: 'Ensure SEED_SECRET in Vercel matches the secret in your URL'
      }, { status: 401 });
    }

    console.log('Starting database seeding...');

    // Clean existing data
    await prisma.auditLog.deleteMany();
    await prisma.gradeEntry.deleteMany();
    await prisma.computedGrade.deleteMany();
    await prisma.enrollment.deleteMany();
    await prisma.assessment.deleteMany();
    await prisma.courseInstructor.deleteMany();
    await prisma.course.deleteMany();
    await prisma.student.deleteMany();
    await prisma.gradeScale.deleteMany();
    await prisma.user.deleteMany();
    await prisma.faculty.deleteMany();

    console.log('✓ Cleaned existing data');

    // ========== CREATE FACULTIES ==========
    const facultyEngineering = await prisma.faculty.create({
      data: {
        name: 'School of Engineering',
        code: 'ENG',
        description: 'Faculty of Engineering and Technology',
      }
    });

    const facultyEducation = await prisma.faculty.create({
      data: {
        name: 'School of Education',
        code: 'EDU',
        description: 'Faculty of Education and Teacher Training',
      }
    });

    const facultyAgriculture = await prisma.faculty.create({
      data: {
        name: 'School of Agriculture',
        code: 'AGR',
        description: 'Faculty of Agriculture and Environmental Sciences',
      }
    });

    const facultyComputing = await prisma.faculty.create({
      data: {
        name: 'School of Computing',
        code: 'CSC',
        description: 'Faculty of Computing and Information Technology',
      }
    });

    console.log('✓ Created 4 faculties');

    // ========== CREATE USERS ==========
    const adminPassword = await bcrypt.hash('password123', 10);
    const admin = await prisma.user.create({
      data: {
        email: 'admin@sgms.com',
        name: 'Admin User',
        passwordHash: adminPassword,
        role: 'ADMIN',
        department: 'Administration',
      }
    });

    const registrarPassword = await bcrypt.hash('password123', 10);
    const registrar = await prisma.user.create({
      data: {
        email: 'registrar@sgms.com',
        name: 'Jane Registrar',
        passwordHash: registrarPassword,
        role: 'REGISTRAR',
        department: 'Registrar Office',
      }
    });

    // ========== CREATE INSTRUCTORS BY FACULTY ==========
    const instructorPassword = await bcrypt.hash('password123', 10);

    // Engineering Instructors
    const instrEng1 = await prisma.user.create({
      data: {
        email: 'dr.smith@sgms.com',
        name: 'Dr. John Smith',
        passwordHash: instructorPassword,
        role: 'INSTRUCTOR',
        department: 'Mechanical Engineering',
        faculty: { connect: { id: facultyEngineering.id } }
      }
    });

    const instrEng2 = await prisma.user.create({
      data: {
        email: 'prof.johnson@sgms.com',
        name: 'Prof. Michael Johnson',
        passwordHash: instructorPassword,
        role: 'INSTRUCTOR',
        department: 'Civil Engineering',
        faculty: { connect: { id: facultyEngineering.id } }
      }
    });

    // Education Instructors
    const instrEdu1 = await prisma.user.create({
      data: {
        email: 'dr.williams@sgms.com',
        name: 'Dr. Sarah Williams',
        passwordHash: instructorPassword,
        role: 'INSTRUCTOR',
        department: 'Psychology & Education',
        faculty: { connect: { id: facultyEducation.id } }
      }
    });

    const instrEdu2 = await prisma.user.create({
      data: {
        email: 'prof.brown@sgms.com',
        name: 'Prof. Robert Brown',
        passwordHash: instructorPassword,
        role: 'INSTRUCTOR',
        department: 'Curriculum & Instruction',
        faculty: { connect: { id: facultyEducation.id } }
      }
    });

    // Agriculture Instructors
    const instrAgr1 = await prisma.user.create({
      data: {
        email: 'dr.davis@sgms.com',
        name: 'Dr. James Davis',
        passwordHash: instructorPassword,
        role: 'INSTRUCTOR',
        department: 'Crop Science',
        faculty: { connect: { id: facultyAgriculture.id } }
      }
    });

    const instrAgr2 = await prisma.user.create({
      data: {
        email: 'prof.miller@sgms.com',
        name: 'Prof. Patricia Miller',
        passwordHash: instructorPassword,
        role: 'INSTRUCTOR',
        department: 'Animal Science',
        faculty: { connect: { id: facultyAgriculture.id } }
      }
    });

    // Computing Instructors
    const instrCsc1 = await prisma.user.create({
      data: {
        email: 'dr.wilson@sgms.com',
        name: 'Dr. Thomas Wilson',
        passwordHash: instructorPassword,
        role: 'INSTRUCTOR',
        department: 'Software Engineering',
        faculty: { connect: { id: facultyComputing.id } }
      }
    });

    const instrCsc2 = await prisma.user.create({
      data: {
        email: 'prof.taylor@sgms.com',
        name: 'Prof. Lisa Taylor',
        passwordHash: instructorPassword,
        role: 'INSTRUCTOR',
        department: 'Networks & Security',
        faculty: { connect: { id: facultyComputing.id } }
      }
    });

    console.log('✓ Created 8 instructors across faculties');

    // ========== CREATE STUDENTS ==========
    const studentPassword = await bcrypt.hash('password123', 10);
    const students: any[] = [];

    // Engineering Students
    const engineeringStudents = [
      { firstName: 'Alex', lastName: 'Johnson', email: 'alex.johnson@sgms.com' },
      { firstName: 'Maria', lastName: 'Garcia', email: 'maria.garcia@sgms.com' },
      { firstName: 'David', lastName: 'Chen', email: 'david.chen@sgms.com' },
      { firstName: 'Sarah', lastName: 'Patel', email: 'sarah.patel@sgms.com' },
      { firstName: 'Michael', lastName: 'Rodriguez', email: 'michael.rodriguez@sgms.com' }
    ];

    for (let i = 0; i < engineeringStudents.length; i++) {
      const studentData = engineeringStudents[i];
      const student = await prisma.student.create({
        data: {
          admissionNo: `ENG${1001 + i}`,
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          email: studentData.email,
          courseProgram: 'Bachelor of Engineering',
          yearOfStudy: Math.floor(i / 2) + 1,
          status: 'ACTIVE'
        }
      });

      // Create corresponding User record for authentication
      await prisma.user.create({
        data: {
          email: studentData.email,
          name: `${studentData.firstName} ${studentData.lastName}`,
          passwordHash: studentPassword,
          role: 'STUDENT',
          department: 'Engineering',
          faculty: { connect: { id: facultyEngineering.id } }
        }
      });

      students.push({ student, faculty: 'Engineering' });
    }

    // Education Students
    const educationStudents = [
      { firstName: 'Emily', lastName: 'Thompson', email: 'emily.thompson@sgms.com' },
      { firstName: 'James', lastName: 'Wilson', email: 'james.wilson@sgms.com' },
      { firstName: 'Olivia', lastName: 'Martinez', email: 'olivia.martinez@sgms.com' },
      { firstName: 'Benjamin', lastName: 'Lee', email: 'benjamin.lee@sgms.com' },
      { firstName: 'Sophia', lastName: 'Anderson', email: 'sophia.anderson@sgms.com' }
    ];

    for (let i = 0; i < educationStudents.length; i++) {
      const studentData = educationStudents[i];
      const student = await prisma.student.create({
        data: {
          admissionNo: `EDU${1001 + i}`,
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          email: studentData.email,
          courseProgram: 'Bachelor of Education',
          yearOfStudy: Math.floor(i / 2) + 1,
          status: 'ACTIVE'
        }
      });

      // Create corresponding User record for authentication
      await prisma.user.create({
        data: {
          email: studentData.email,
          name: `${studentData.firstName} ${studentData.lastName}`,
          passwordHash: studentPassword,
          role: 'STUDENT',
          department: 'Education',
          faculty: { connect: { id: facultyEducation.id } }
        }
      });

      students.push({ student, faculty: 'Education' });
    }

    // Agriculture Students
    const agricultureStudents = [
      { firstName: 'William', lastName: 'Taylor', email: 'william.taylor@sgms.com' },
      { firstName: 'Isabella', lastName: 'Brown', email: 'isabella.brown@sgms.com' },
      { firstName: 'Lucas', lastName: 'Davis', email: 'lucas.davis@sgms.com' },
      { firstName: 'Ava', lastName: 'Miller', email: 'ava.miller@sgms.com' },
      { firstName: 'Ethan', lastName: 'Wilson', email: 'ethan.wilson@sgms.com' }
    ];

    for (let i = 0; i < agricultureStudents.length; i++) {
      const studentData = agricultureStudents[i];
      const student = await prisma.student.create({
        data: {
          admissionNo: `AGR${1001 + i}`,
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          email: studentData.email,
          courseProgram: 'Bachelor of Agriculture',
          yearOfStudy: Math.floor(i / 2) + 1,
          status: 'ACTIVE'
        }
      });

      // Create corresponding User record for authentication
      await prisma.user.create({
        data: {
          email: studentData.email,
          name: `${studentData.firstName} ${studentData.lastName}`,
          passwordHash: studentPassword,
          role: 'STUDENT',
          department: 'Agriculture',
          faculty: { connect: { id: facultyAgriculture.id } }
        }
      });

      students.push({ student, faculty: 'Agriculture' });
    }

    // Computing Students
    const computingStudents = [
      { firstName: 'Charlotte', lastName: 'Moore', email: 'charlotte.moore@sgms.com' },
      { firstName: 'Mason', lastName: 'Jackson', email: 'mason.jackson@sgms.com' },
      { firstName: 'Harper', lastName: 'White', email: 'harper.white@sgms.com' },
      { firstName: 'Elijah', lastName: 'Harris', email: 'elijah.harris@sgms.com' },
      { firstName: 'Amelia', lastName: 'Clark', email: 'amelia.clark@sgms.com' }
    ];

    for (let i = 0; i < computingStudents.length; i++) {
      const studentData = computingStudents[i];
      const student = await prisma.student.create({
        data: {
          admissionNo: `CSC${1001 + i}`,
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          email: studentData.email,
          courseProgram: 'Bachelor of Computing',
          yearOfStudy: Math.floor(i / 2) + 1,
          status: 'ACTIVE'
        }
      });

      // Create corresponding User record for authentication
      await prisma.user.create({
        data: {
          email: studentData.email,
          name: `${studentData.firstName} ${studentData.lastName}`,
          passwordHash: studentPassword,
          role: 'STUDENT',
          department: 'Computing',
          faculty: { connect: { id: facultyComputing.id } }
        }
      });

      students.push({ student, faculty: 'Computing' });
    }

    console.log('✓ Created 20 students');

    // ========== CREATE COURSES BY FACULTY ==========

    // Engineering Courses
    const engCourse1 = await prisma.course.create({
      data: {
        code: 'ENG101',
        title: 'Introduction to Engineering',
        credits: 3,
        faculty: { connect: { id: facultyEngineering.id } }
      }
    });

    const engCourse2 = await prisma.course.create({
      data: {
        code: 'ENG201',
        title: 'Thermodynamics',
        credits: 4,
        faculty: { connect: { id: facultyEngineering.id } }
      }
    });

    // Education Courses
    const eduCourse1 = await prisma.course.create({
      data: {
        code: 'EDU101',
        title: 'Education Psychology',
        credits: 3,
        faculty: { connect: { id: facultyEducation.id } }
      }
    });

    const eduCourse2 = await prisma.course.create({
      data: {
        code: 'EDU201',
        title: 'Curriculum Development',
        credits: 3,
        faculty: { connect: { id: facultyEducation.id } }
      }
    });

    // Agriculture Courses
    const agrCourse1 = await prisma.course.create({
      data: {
        code: 'AGR101',
        title: 'Agricultural Science Fundamentals',
        credits: 3,
        faculty: { connect: { id: facultyAgriculture.id } }
      }
    });

    const agrCourse2 = await prisma.course.create({
      data: {
        code: 'AGR201',
        title: 'Crop Production',
        credits: 4,
        faculty: { connect: { id: facultyAgriculture.id } }
      }
    });

    // Computing Courses
    const cscCourse1 = await prisma.course.create({
      data: {
        code: 'CSC101',
        title: 'Introduction to Programming',
        credits: 3,
        faculty: { connect: { id: facultyComputing.id } }
      }
    });

    const cscCourse2 = await prisma.course.create({
      data: {
        code: 'CSC201',
        title: 'Data Structures',
        credits: 4,
        faculty: { connect: { id: facultyComputing.id } }
      }
    });

    console.log('✓ Created 8 courses across faculties');

    // ========== ASSIGN INSTRUCTORS TO COURSES ==========
    await prisma.courseInstructor.createMany({
      data: [
        { courseId: engCourse1.id, instructorUserId: instrEng1.id },
        { courseId: engCourse2.id, instructorUserId: instrEng2.id },
        { courseId: eduCourse1.id, instructorUserId: instrEdu1.id },
        { courseId: eduCourse2.id, instructorUserId: instrEdu2.id },
        { courseId: agrCourse1.id, instructorUserId: instrAgr1.id },
        { courseId: agrCourse2.id, instructorUserId: instrAgr2.id },
        { courseId: cscCourse1.id, instructorUserId: instrCsc1.id },
        { courseId: cscCourse2.id, instructorUserId: instrCsc2.id },
      ]
    });

    console.log('✓ Assigned instructors to courses');

    // ========== CREATE ASSESSMENTS FOR EACH COURSE ==========
    const assessmentsByInstructor: Record<string, Array<{name: string; weight: number; maxMarks: number}>> = {
      [instrEng1.id]: [
        { name: 'Quiz 1', weight: 10, maxMarks: 10 },
        { name: 'Assignment 1', weight: 15, maxMarks: 20 },
        { name: 'Midterm Exam', weight: 25, maxMarks: 40 },
        { name: 'Final Exam', weight: 50, maxMarks: 100 }
      ],
      [instrEng2.id]: [
        { name: 'Lab Work', weight: 20, maxMarks: 25 },
        { name: 'Quiz', weight: 10, maxMarks: 15 },
        { name: 'Midterm', weight: 25, maxMarks: 40 },
        { name: 'Final Exam', weight: 45, maxMarks: 100 }
      ],
      [instrEdu1.id]: [
        { name: 'Class Participation', weight: 15, maxMarks: 20 },
        { name: 'Assignment', weight: 20, maxMarks: 30 },
        { name: 'Presentation', weight: 25, maxMarks: 40 },
        { name: 'Final Project', weight: 40, maxMarks: 100 }
      ],
      [instrEdu2.id]: [
        { name: 'Weekly Reflections', weight: 20, maxMarks: 25 },
        { name: 'Group Discussion', weight: 15, maxMarks: 20 },
        { name: 'Midterm', weight: 25, maxMarks: 40 },
        { name: 'Final Exam', weight: 40, maxMarks: 100 }
      ],
      [instrAgr1.id]: [
        { name: 'Field Report', weight: 20, maxMarks: 25 },
        { name: 'Lab Analysis', weight: 15, maxMarks: 20 },
        { name: 'Midterm', weight: 25, maxMarks: 40 },
        { name: 'Final Exam', weight: 40, maxMarks: 100 }
      ],
      [instrAgr2.id]: [
        { name: 'Case Study', weight: 20, maxMarks: 25 },
        { name: 'Research Paper', weight: 20, maxMarks: 30 },
        { name: 'Presentation', weight: 20, maxMarks: 40 },
        { name: 'Final Exam', weight: 40, maxMarks: 100 }
      ],
      [instrCsc1.id]: [
        { name: 'Coding Assignment 1', weight: 15, maxMarks: 20 },
        { name: 'Quiz 1', weight: 10, maxMarks: 15 },
        { name: 'Midterm', weight: 25, maxMarks: 40 },
        { name: 'Final Project', weight: 50, maxMarks: 100 }
      ],
      [instrCsc2.id]: [
        { name: 'Algorithm Analysis', weight: 20, maxMarks: 25 },
        { name: 'Implementation', weight: 15, maxMarks: 20 },
        { name: 'Midterm', weight: 25, maxMarks: 40 },
        { name: 'Final Exam', weight: 40, maxMarks: 100 }
      ]
    };

    // Create assessments for each course
    for (const [instructorId, assessments] of Object.entries(assessmentsByInstructor)) {
      const instructorCourses = await prisma.courseInstructor.findMany({
        where: { instructorUserId: instructorId },
        include: { course: true }
      });

      for (const courseInstructor of instructorCourses) {
        for (const assessment of assessments) {
          await prisma.assessment.create({
            data: {
              name: assessment.name,
              weight: assessment.weight,
              maxMarks: assessment.maxMarks,
              course: { connect: { id: courseInstructor.course.id } }
            }
          });
        }
      }
    }

    console.log('✓ Created assessments for all courses');

    // ========== ENROLL STUDENTS IN COURSES ==========
    // Enroll students in courses based on their faculty
    const enrolledEngineeringStudents = students.filter(s => s.faculty === 'Engineering');
    const enrolledEducationStudents = students.filter(s => s.faculty === 'Education');
    const enrolledAgricultureStudents = students.filter(s => s.faculty === 'Agriculture');
    const enrolledComputingStudents = students.filter(s => s.faculty === 'Computing');

    // Enroll Engineering students in Engineering courses
    for (const student of enrolledEngineeringStudents) {
      await prisma.enrollment.createMany({
        data: [
          { studentId: student.student.id, courseId: engCourse1.id },
          { studentId: student.student.id, courseId: engCourse2.id }
        ]
      });
    }

    // Enroll Education students in Education courses
    for (const student of enrolledEducationStudents) {
      await prisma.enrollment.createMany({
        data: [
          { studentId: student.student.id, courseId: eduCourse1.id },
          { studentId: student.student.id, courseId: eduCourse2.id }
        ]
      });
    }

    // Enroll Agriculture students in Agriculture courses
    for (const student of enrolledAgricultureStudents) {
      await prisma.enrollment.createMany({
        data: [
          { studentId: student.student.id, courseId: agrCourse1.id },
          { studentId: student.student.id, courseId: agrCourse2.id }
        ]
      });
    }

    // Enroll Computing students in Computing courses
    for (const student of enrolledComputingStudents) {
      await prisma.enrollment.createMany({
        data: [
          { studentId: student.student.id, courseId: cscCourse1.id },
          { studentId: student.student.id, courseId: cscCourse2.id }
        ]
      });
    }

    console.log('✓ Enrolled students in courses');

    // ========== CREATE GRADE SCALE ==========
    await prisma.gradeScale.createMany({
      data: [
        { letter: 'A', min: 90, max: 100, points: 4.0 },
        { letter: 'A-', min: 85, max: 89, points: 3.7 },
        { letter: 'B+', min: 80, max: 84, points: 3.3 },
        { letter: 'B', min: 75, max: 79, points: 3.0 },
        { letter: 'B-', min: 70, max: 74, points: 2.7 },
        { letter: 'C+', min: 65, max: 69, points: 2.3 },
        { letter: 'C', min: 60, max: 64, points: 2.0 },
        { letter: 'C-', min: 55, max: 59, points: 1.7 },
        { letter: 'D', min: 50, max: 54, points: 1.0 },
        { letter: 'F', min: 0, max: 49, points: 0.0 }
      ]
    });

    console.log('✓ Created grade scale');

    console.log('🎉 Database seeding completed successfully!');

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      users: {
        admin: 'admin@sgms.com',
        registrar: 'registrar@sgms.com',
        instructors: [
          'dr.smith@sgms.com',
          'prof.johnson@sgms.com',
          'dr.williams@sgms.com',
          'prof.brown@sgms.com',
          'dr.davis@sgms.com',
          'prof.miller@sgms.com',
          'dr.wilson@sgms.com',
          'prof.taylor@sgms.com'
        ],
        students: [
          'alex.johnson@sgms.com',
          'maria.garcia@sgms.com',
          'david.chen@sgms.com',
          'sarah.patel@sgms.com',
          'michael.rodriguez@sgms.com',
          'emily.thompson@sgms.com',
          'james.wilson@sgms.com',
          'olivia.martinez@sgms.com',
          'benjamin.lee@sgms.com',
          'sophia.anderson@sgms.com',
          'william.taylor@sgms.com',
          'isabella.brown@sgms.com',
          'lucas.davis@sgms.com',
          'ava.miller@sgms.com',
          'ethan.wilson@sgms.com',
          'charlotte.moore@sgms.com',
          'mason.jackson@sgms.com',
          'harper.white@sgms.com',
          'elijah.harris@sgms.com',
          'amelia.clark@sgms.com'
        ]
      }
    });

  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}