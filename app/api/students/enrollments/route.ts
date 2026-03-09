import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/authOptions';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the student
    const student = await prisma.student.findUnique({
      where: { email: session.user.email },
      include: {
        enrollments: {
          include: {
            course: {
              include: {
                faculty: true,
                instructors: { include: { instructor: true } },
                assessments: true
              }
            }
          }
        }
      }
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Get grades for all courses
    const enrolledCourses = student.enrollments.map((enrollment) => {
      return {
        id: enrollment.course.id,
        code: enrollment.course.code,
        title: enrollment.course.title,
        credits: enrollment.course.credits,
        faculty: enrollment.course.faculty.name,
        instructor: enrollment.course.instructors?.[0]?.instructor?.name || 'Unassigned',
        assessments: enrollment.course.assessments.length
      };
    });

    return NextResponse.json({
      student: {
        id: student.id,
        admissionNo: student.admissionNo,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        courseProgram: student.courseProgram,
        yearOfStudy: student.yearOfStudy,
        status: student.status
      },
      enrolledCourses,
      totalEnrolledCourses: enrolledCourses.length
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch student enrollments', details: error.message },
      { status: 500 }
    );
  }
}
