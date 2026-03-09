import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/authOptions';

const prisma = new PrismaClient();

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

const studentSchema = z.object({
  admissionNo: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  courseProgram: z.string().min(1),
  yearOfStudy: z.number().int().min(1),
  status: z.enum(['ACTIVE', 'INACTIVE'])
});

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'INSTRUCTOR' && session.user.role !== 'REGISTRAR')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let students;
  if (session.user.role === 'INSTRUCTOR') {
    // For instructors, only return students enrolled in their courses
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        instructorCourses: {
          include: {
            course: {
              include: {
                enrollments: {
                  include: { student: true }
                }
              }
            }
          }
        }
      }
    });

    // Get unique students from all instructor's courses
    const studentSet = new Set();
    const uniqueStudents = [];
    for (const courseInstructor of user?.instructorCourses || []) {
      for (const enrollment of courseInstructor.course.enrollments) {
        if (!studentSet.has(enrollment.student.id)) {
          studentSet.add(enrollment.student.id);
          uniqueStudents.push(enrollment.student);
        }
      }
    }
    students = uniqueStudents;
  } else {
    // For admin and registrar, return all students
    students = await prisma.student.findMany({ orderBy: { createdAt: 'desc' } });
  }

  return NextResponse.json(students);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const body = await req.json();
  const parsed = studentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
  }
  try {
    const student = await prisma.student.create({
      data: {
        admissionNo: parsed.data.admissionNo,
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        email: parsed.data.email,
        courseProgram: parsed.data.courseProgram,
        yearOfStudy: parsed.data.yearOfStudy,
        status: parsed.data.status,
      },
    });
    // TODO: Add audit log
    return NextResponse.json(student, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to create student', details: e.message }, { status: 500 });
  }
}
