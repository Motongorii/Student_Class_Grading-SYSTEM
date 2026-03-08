import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Password hash - declare first
  const password = await bcrypt.hash('password123', 10);

      // Create GOVE 101 - Government course if not exists
      const goveCourse = await prisma.course.upsert({
        where: { code: 'GOVE101' },
        update: {},
        create: {
          code: 'GOVE101',
          title: 'GOVE 101 - Government',
          credits: 3,
        },
      });

      // Seed 5 assessments for GOVE 101
      const assessments = [
        { name: 'Quiz 1', weight: 10, maxMarks: 10 },
        { name: 'Quiz 2', weight: 10, maxMarks: 10 },
        { name: 'Midterm Exam', weight: 30, maxMarks: 30 },
        { name: 'Project', weight: 20, maxMarks: 20 },
        { name: 'Final Exam', weight: 30, maxMarks: 30 },
      ];
      for (const a of assessments) {
        // upsert by first trying to find a matching assessment, since
        // there isn't a compound unique constraint on name+courseId
        const existing = await prisma.assessment.findFirst({
          where: { name: a.name, courseId: goveCourse.id },
        });
        if (!existing) {
          await prisma.assessment.create({
            data: { ...a, courseId: goveCourse.id },
          });
        }
      }
    // Add 25 students (and users) for GOVE 101 - Government
    const studentData = [
      { firstName: 'David', lastName: 'Miller', email: 'student4@sgms.com', admissionNo: 'ADM004' },
      { firstName: 'Emma', lastName: 'Davis', email: 'student5@sgms.com', admissionNo: 'ADM005' },
      { firstName: 'Frank', lastName: 'Garcia', email: 'student6@sgms.com', admissionNo: 'ADM006' },
      { firstName: 'Grace', lastName: 'Martinez', email: 'student7@sgms.com', admissionNo: 'ADM007' },
      { firstName: 'Henry', lastName: 'Rodriguez', email: 'student8@sgms.com', admissionNo: 'ADM008' },
      { firstName: 'Isabella', lastName: 'Martins', email: 'student9@sgms.com', admissionNo: 'ADM009' },
      { firstName: 'Jack', lastName: 'Lee', email: 'student10@sgms.com', admissionNo: 'ADM010' },
      { firstName: 'Katherine', lastName: 'Walker', email: 'student11@sgms.com', admissionNo: 'ADM011' },
      { firstName: 'Liam', lastName: 'Hall', email: 'student12@sgms.com', admissionNo: 'ADM012' },
      { firstName: 'Mia', lastName: 'Allen', email: 'student13@sgms.com', admissionNo: 'ADM013' },
      { firstName: 'Noah', lastName: 'Young', email: 'student14@sgms.com', admissionNo: 'ADM014' },
      { firstName: 'Olivia', lastName: 'Hernandez', email: 'student15@sgms.com', admissionNo: 'ADM015' },
      { firstName: 'Paul', lastName: 'King', email: 'student16@sgms.com', admissionNo: 'ADM016' },
      { firstName: 'Quinn', lastName: 'Wright', email: 'student17@sgms.com', admissionNo: 'ADM017' },
      { firstName: 'Ruby', lastName: 'Lopez', email: 'student18@sgms.com', admissionNo: 'ADM018' },
      { firstName: 'Samuel', lastName: 'Hill', email: 'student19@sgms.com', admissionNo: 'ADM019' },
      { firstName: 'Tina', lastName: 'Scott', email: 'student20@sgms.com', admissionNo: 'ADM020' },
      { firstName: 'Uma', lastName: 'Green', email: 'student21@sgms.com', admissionNo: 'ADM021' },
      { firstName: 'Victor', lastName: 'Adams', email: 'student22@sgms.com', admissionNo: 'ADM022' },
      { firstName: 'Wendy', lastName: 'Baker', email: 'student23@sgms.com', admissionNo: 'ADM023' },
      { firstName: 'Xavier', lastName: 'Nelson', email: 'student24@sgms.com', admissionNo: 'ADM024' },
      { firstName: 'Yara', lastName: 'Carter', email: 'student25@sgms.com', admissionNo: 'ADM025' },
      { firstName: 'Zane', lastName: 'Mitchell', email: 'student26@sgms.com', admissionNo: 'ADM026' },
      { firstName: 'Ava', lastName: 'Perez', email: 'student27@sgms.com', admissionNo: 'ADM027' },
      { firstName: 'Benjamin', lastName: 'Roberts', email: 'student28@sgms.com', admissionNo: 'ADM028' },
    ];
    for (const [i, s] of studentData.entries()) {
      await prisma.user.upsert({
        where: { email: s.email },
        update: { passwordHash: password, name: `${s.firstName} ${s.lastName}`, role: 'STUDENT' },
        create: {
          name: `${s.firstName} ${s.lastName}`,
          email: s.email,
          passwordHash: password,
          role: 'STUDENT',
        },
      });
      await prisma.student.upsert({
        where: { email: s.email },
        update: {
          admissionNo: s.admissionNo,
          firstName: s.firstName,
          lastName: s.lastName,
          courseProgram: 'GOVE 101 - Government',
          yearOfStudy: 1,
          status: 'ACTIVE',
        },
        create: {
          admissionNo: s.admissionNo,
          firstName: s.firstName,
          lastName: s.lastName,
          email: s.email,
          courseProgram: 'GOVE 101 - Government',
          yearOfStudy: 1,
          status: 'ACTIVE',
        },
      });
    }
  
  // Users (upsert to avoid unique constraint errors)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sgms.com' },
    update: { passwordHash: password, name: 'Admin User', role: 'ADMIN' },
    create: {
      name: 'Admin User',
      email: 'admin@sgms.com',
      passwordHash: password,
      role: 'ADMIN',
    },
  });
  const registrar = await prisma.user.upsert({
    where: { email: 'registrar@sgms.com' },
    update: { passwordHash: password, name: 'Registrar User', role: 'REGISTRAR' },
    create: {
      name: 'Registrar User',
      email: 'registrar@sgms.com',
      passwordHash: password,
      role: 'REGISTRAR',
    },
  });
  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@sgms.com' },
    update: { passwordHash: password, name: 'Instructor User', role: 'INSTRUCTOR' },
    create: {
      name: 'Instructor User',
      email: 'instructor@sgms.com',
      passwordHash: password,
      role: 'INSTRUCTOR',
    },
  });
  // Add student1 as a User for login
  const studentUser1 = await prisma.user.upsert({
    where: { email: 'student1@sgms.com' },
    update: { passwordHash: password, name: 'Alice Smith', role: 'STUDENT' },
    create: {
      name: 'Alice Smith',
      email: 'student1@sgms.com',
      passwordHash: password,
      role: 'STUDENT',
    },
  });
  // Add student2 as a User for login
  const studentUser2 = await prisma.user.upsert({
    where: { email: 'student2@sgms.com' },
    update: { passwordHash: password, name: 'Bob Johnson', role: 'STUDENT' },
    create: {
      name: 'Bob Johnson',
      email: 'student2@sgms.com',
      passwordHash: password,
      role: 'STUDENT',
    },
  });
  // Add student3 as a User for login
  const studentUser3 = await prisma.user.upsert({
    where: { email: 'student3@sgms.com' },
    update: { passwordHash: password, name: 'Carol Williams', role: 'STUDENT' },
    create: {
      name: 'Carol Williams',
      email: 'student3@sgms.com',
      passwordHash: password,
      role: 'STUDENT',
    },
  });

  // ...existing code...

  // Students (upsert to avoid unique constraint errors)
  await prisma.student.upsert({
    where: { email: 'student1@sgms.com' },
    update: {
      admissionNo: 'ADM001',
      firstName: 'Alice',
      lastName: 'Smith',
      courseProgram: 'Computer Science',
      yearOfStudy: 1,
      status: 'ACTIVE',
    },
    create: {
      admissionNo: 'ADM001',
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'student1@sgms.com',
      courseProgram: 'Computer Science',
      yearOfStudy: 1,
      status: 'ACTIVE',
    },
  });
  await prisma.student.upsert({
    where: { email: 'student2@sgms.com' },
    update: {
      admissionNo: 'ADM002',
      firstName: 'Bob',
      lastName: 'Johnson',
      courseProgram: 'Computer Science',
      yearOfStudy: 2,
      status: 'ACTIVE',
    },
    create: {
      admissionNo: 'ADM002',
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'student2@sgms.com',
      courseProgram: 'Computer Science',
      yearOfStudy: 2,
      status: 'ACTIVE',
    },
  });
  await prisma.student.upsert({
    where: { email: 'student3@sgms.com' },
    update: {
      admissionNo: 'ADM003',
      firstName: 'Carol',
      lastName: 'Williams',
      courseProgram: 'Mathematics',
      yearOfStudy: 1,
      status: 'ACTIVE',
    },
    create: {
      admissionNo: 'ADM003',
      firstName: 'Carol',
      lastName: 'Williams',
      email: 'student3@sgms.com',
      courseProgram: 'Mathematics',
      yearOfStudy: 1,
      status: 'ACTIVE',
    },
  });

  // Courses
  const course1 = await prisma.course.create({
    data: {
      code: 'CS101',
      title: 'Intro to Computer Science',
      credits: 3,
    },
  });
  const course2 = await prisma.course.create({
    data: {
      code: 'MATH201',
      title: 'Advanced Mathematics',
      credits: 4,
    },
  });

  // Assign instructor to courses
  await prisma.courseInstructor.createMany({
    data: [
      { courseId: course1.id, instructorUserId: instructor.id },
      { courseId: course2.id, instructorUserId: instructor.id },
    ],
  });

  // Enroll students
  const allStudents = await prisma.student.findMany();
  await prisma.enrollment.createMany({
    data: [
      { studentId: allStudents[0].id, courseId: course1.id },
      { studentId: allStudents[1].id, courseId: course1.id },
      { studentId: allStudents[2].id, courseId: course2.id },
    ],
  });

  // Grade scale
  await prisma.gradeScale.createMany({
    data: [
      { letter: 'A', min: 70, max: 100, points: 4.0 },
      { letter: 'B', min: 60, max: 69, points: 3.0 },
      { letter: 'C', min: 50, max: 59, points: 2.0 },
      { letter: 'D', min: 40, max: 49, points: 1.0 },
      { letter: 'E', min: 0, max: 39, points: 0.0 },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
