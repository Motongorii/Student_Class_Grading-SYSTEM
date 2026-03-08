import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

const prisma = new PrismaClient();

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get student details
    const student = await prisma.student.findUnique({
      where: { email: session.user.email }
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Get all courses the student is enrolled in
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: student.id },
      include: {
        course: true
      }
    });

    // Get computed grades for each course
    const grades = await Promise.all(
      enrollments.map(async (enrollment) => {
        const computedGrade = await prisma.computedGrade.findFirst({
          where: {
            studentId: student.id,
            courseId: enrollment.courseId
          }
        });

        return {
          course: enrollment.course,
          totalWeighted: computedGrade?.totalWeighted,
          letterGrade: computedGrade?.letterGrade,
          gpaPoints: computedGrade?.gpaPoints,
          computedAt: computedGrade?.computedAt
        };
      })
    );

    // Calculate summary statistics
    const validGrades = grades.filter(g => g.gpaPoints !== null && g.gpaPoints !== undefined);
    const totalCourses = grades.length;
    const passedCourses = validGrades.filter(g => g.totalWeighted! >= 50).length;
    const totalCredits = grades.reduce((sum, g) => sum + g.course.credits, 0);
    const overallGPA = validGrades.length > 0
      ? validGrades.reduce((sum, g) => sum + g.gpaPoints!, 0) / validGrades.length
      : null;

    return NextResponse.json({
      student: {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        admissionNo: student.admissionNo,
        courseProgram: student.courseProgram,
        yearOfStudy: student.yearOfStudy,
        status: student.status
      },
      grades,
      summary: {
        totalCourses,
        passedCourses,
        totalCredits,
        overallGPA
      }
    });

  } catch (error) {
    console.error('Error fetching transcript:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}