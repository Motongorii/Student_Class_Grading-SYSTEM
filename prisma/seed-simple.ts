import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting seed...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.upsert({
      where: { email: 'admin@sgms.com' },
      update: {},
      create: {
        email: 'admin@sgms.com',
        name: 'Admin User',
        passwordHash: adminPassword,
        role: 'ADMIN',
      },
    });
    console.log('✓ Admin user created');

    // Create instructor user
    const instructorPassword = await bcrypt.hash('instructor123', 10);
    await prisma.user.upsert({
      where: { email: 'instructor@sgms.com' },
      update: {},
      create: {
        email: 'instructor@sgms.com',
        name: 'Instructor User',
        passwordHash: instructorPassword,
        role: 'INSTRUCTOR',
      },
    });
    console.log('✓ Instructor user created');

    // Create registrar user
    const registrarPassword = await bcrypt.hash('registrar123', 10);
    await prisma.user.upsert({
      where: { email: 'registrar@sgms.com' },
      update: {},
      create: {
        email: 'registrar@sgms.com',
        name: 'Registrar User',
        passwordHash: registrarPassword,
        role: 'REGISTRAR',
      },
    });
    console.log('✓ Registrar user created');

    // Create student user
    const studentPassword = await bcrypt.hash('student123', 10);
    const student = await prisma.student.upsert({
      where: { email: 'alex.johnson@sgms.com' },
      update: {},
      create: {
        email: 'alex.johnson@sgms.com',
        firstName: 'Alex',
        lastName: 'Johnson',
        admissionNo: 'ENG1001',
        courseProgram: 'Bachelor of Engineering',
        yearOfStudy: 1,
        status: 'ACTIVE',
      },
    });
    console.log('✓ Student created');

    // Create user for student
    await prisma.user.upsert({
      where: { email: 'alex.johnson@sgms.com' },
      update: {},
      create: {
        email: 'alex.johnson@sgms.com',
        name: 'Alex Johnson',
        passwordHash: studentPassword,
        role: 'STUDENT',
      },
    });
    console.log('✓ Student user created');

    // Create a sample faculty
    const faculty = await prisma.faculty.upsert({
      where: { code: 'CS' },
      update: {},
      create: {
        name: 'Computer Science',
        code: 'CS',
        description: 'Department of Computer Science',
      },
    });
    console.log('✓ Sample faculty created');

    // Create a sample course
    const course = await prisma.course.upsert({
      where: { code: 'CS101' },
      update: {},
      create: {
        code: 'CS101',
        title: 'Introduction to Computer Science',
        credits: 3,
        facultyId: faculty.id,
      },
    });
    console.log('✓ Sample course created');

    // Enroll student in course
    await prisma.enrollment.upsert({
      where: {
        studentId_courseId: {
          studentId: student.id,
          courseId: course.id,
        },
      },
      update: {},
      create: {
        studentId: student.id,
        courseId: course.id,
      },
    });
    console.log('✓ Student enrolled in course');

    console.log('✅ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
