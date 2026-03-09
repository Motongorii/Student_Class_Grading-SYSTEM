import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting comprehensive seed...');

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
    for (let i = 1; i <= 5; i++) {
      const student = await prisma.student.create({
        data: {
          admissionNo: `ENG${1000 + i}`,
          firstName: `Engineering${i}`,
          lastName: `Student${i}`,
          email: `eng.student${i}@sgms.com`,
          courseProgram: 'Bachelor of Engineering',
          yearOfStudy: Math.floor(i / 2) + 1,
          status: 'ACTIVE'
        }
      });
      students.push({ student, faculty: 'Engineering' });
    }

    // Education Students
    for (let i = 1; i <= 5; i++) {
      const student = await prisma.student.create({
        data: {
          admissionNo: `EDU${1000 + i}`,
          firstName: `Education${i}`,
          lastName: `Student${i}`,
          email: `edu.student${i}@sgms.com`,
          courseProgram: 'Bachelor of Education',
          yearOfStudy: Math.floor(i / 2) + 1,
          status: 'ACTIVE'
        }
      });
      students.push({ student, faculty: 'Education' });
    }

    // Agriculture Students
    for (let i = 1; i <= 5; i++) {
      const student = await prisma.student.create({
        data: {
          admissionNo: `AGR${1000 + i}`,
          firstName: `Agriculture${i}`,
          lastName: `Student${i}`,
          email: `agr.student${i}@sgms.com`,
          courseProgram: 'Bachelor of Agriculture',
          yearOfStudy: Math.floor(i / 2) + 1,
          status: 'ACTIVE'
        }
      });
      students.push({ student, faculty: 'Agriculture' });
    }

    // Computing Students
    for (let i = 1; i <= 5; i++) {
      const student = await prisma.student.create({
        data: {
          admissionNo: `CSC${1000 + i}`,
          firstName: `Computing${i}`,
          lastName: `Student${i}`,
          email: `csc.student${i}@sgms.com`,
          courseProgram: 'Bachelor of Computing',
          yearOfStudy: Math.floor(i / 2) + 1,
          status: 'ACTIVE'
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
        { name: 'Midterm', weight: 25, maxMarks: 40 },
        { name: 'Final Exam', weight: 40, maxMarks: 100 }
      ],
      [instrEdu2.id]: [
        { name: 'Project', weight: 25, maxMarks: 50 },
        { name: 'Presentation', weight: 20, maxMarks: 30 },
        { name: 'Exam', weight: 55, maxMarks: 100 }
      ],
      [instrAgr1.id]: [
        { name: 'Practicum', weight: 30, maxMarks: 40 },
        { name: 'Quiz', weight: 15, maxMarks: 20 },
        { name: 'Midterm', weight: 20, maxMarks: 40 },
        { name: 'Final Exam', weight: 35, maxMarks: 100 }
      ],
      [instrAgr2.id]: [
        { name: 'Field Work', weight: 35, maxMarks: 50 },
        { name: 'Assignment', weight: 15, maxMarks: 25 },
        { name: 'Final Exam', weight: 50, maxMarks: 100 }
      ],
      [instrCsc1.id]: [
        { name: 'Programming Exercise 1', weight: 15, maxMarks: 25 },
        { name: 'Programming Exercise 2', weight: 15, maxMarks: 25 },
        { name: 'Midterm', weight: 25, maxMarks: 40 },
        { name: 'Final Exam', weight: 45, maxMarks: 100 }
      ],
      [instrCsc2.id]: [
        { name: 'Lab Assignment', weight: 20, maxMarks: 30 },
        { name: 'Quiz', weight: 15, maxMarks: 20 },
        { name: 'Project', weight: 20, maxMarks: 40 },
        { name: 'Final Exam', weight: 45, maxMarks: 100 }
      ]
    };

    const coursesByInstructor: Record<string, any> = {
      [instrEng1.id]: engCourse1,
      [instrEng2.id]: engCourse2,
      [instrEdu1.id]: eduCourse1,
      [instrEdu2.id]: eduCourse2,
      [instrAgr1.id]: agrCourse1,
      [instrAgr2.id]: agrCourse2,
      [instrCsc1.id]: cscCourse1,
      [instrCsc2.id]: cscCourse2,
    };

    const assessments: any[] = [];

    for (const [instrId, assmts] of Object.entries(assessmentsByInstructor)) {
      const courseId = coursesByInstructor[instrId].id;
      for (const assmt of assmts) {
        const created = await prisma.assessment.create({
          data: {
            courseId,
            name: assmt.name,
            weight: assmt.weight,
            maxMarks: assmt.maxMarks
          }
        });
        assessments.push(created);
      }
    }

    console.log(`✓ Created ${assessments.length} assessments`);

    // ========== ENROLL STUDENTS IN COURSES ==========
    const enrollmentsByFaculty: Record<string, any[]> = {
      'Engineering': [engCourse1, engCourse2],
      'Education': [eduCourse1, eduCourse2],
      'Agriculture': [agrCourse1, agrCourse2],
      'Computing': [cscCourse1, cscCourse2]
    };

    for (const { student, faculty } of students) {
      const courses = enrollmentsByFaculty[faculty as keyof typeof enrollmentsByFaculty] || [];
      for (const course of courses) {
        await prisma.enrollment.create({
          data: {
            studentId: student.id,
            courseId: course.id
          }
        }).catch(() => {
          // Handle unique constraint if enrollment already exists
        });
      }
    }

    console.log('✓ Enrolled students in courses');

    // ========== CREATE GRADE ENTRIES ==========
    let gradeEntryCount = 0;
    for (const assmt of assessments) {
      // Get students for this course
      const enrollments = await prisma.enrollment.findMany({
        where: { courseId: assmt.courseId },
        include: { student: true }
      });

      // Get instructor teaching this course
      const courseInstructor = await prisma.courseInstructor.findFirst({
        where: { courseId: assmt.courseId },
        include: { instructor: true }
      });

      if (courseInstructor) {
        for (const enrollment of enrollments) {
          const marks = Math.random() * assmt.maxMarks;
          await prisma.gradeEntry.create({
            data: {
              assessmentId: assmt.id,
              studentId: enrollment.studentId,
              marks: Math.round(marks * 100) / 100,
              status: 'APPROVED',
              createdByUserId: courseInstructor.instructorUserId,
              approvedByUserId: registrar.id
            }
          });
          gradeEntryCount++;
        }
      }
    }

    console.log(`✓ Created ${gradeEntryCount} grade entries`);

    // ========== CREATE GRADE SCALES ==========
    await prisma.gradeScale.createMany({
      data: [
        { letter: 'A', min: 80, max: 100, points: 4.0 },
        { letter: 'B', min: 70, max: 79, points: 3.0 },
        { letter: 'C', min: 60, max: 69, points: 2.0 },
        { letter: 'D', min: 50, max: 59, points: 1.0 },
        { letter: 'F', min: 0, max: 49, points: 0.0 }
      ]
    });

    console.log('✓ Created grade scales');

    console.log('\n========== SEED COMPLETE ==========');
    console.log('System ready with:');
    console.log('- 4 Faculties (Engineering, Education, Agriculture, Computing)');
    console.log('- 8 Instructors (2 per faculty)');
    console.log('- 20 Students (5 per faculty)');
    console.log('- 8 Courses (2 per faculty)');
    console.log(`- ${assessments.length} Assessments (4 per course)`);
    console.log(`- ${gradeEntryCount} Grade Entries`);
    console.log('\nTest Credentials:');
    console.log('Admin: admin@sgms.com / password123');
    console.log('Registrar: registrar@sgms.com / password123');
    console.log('Instructors: dr.smith@sgms.com, prof.johnson@sgms.com, etc. / password123');

  } catch (error) {
    console.error('Seed error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
