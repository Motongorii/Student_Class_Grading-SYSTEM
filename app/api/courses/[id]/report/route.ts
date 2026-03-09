import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { computeStudentGrade } from '@/lib/gradeComputation';

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== 'INSTRUCTOR' && session.user.role !== 'REGISTRAR' && session.user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const courseId = params.id;

    // Get course details
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        enrollments: {
          include: {
            student: true
          }
        }
      }
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Compute grades for all enrolled students
    const studentsWithGrades = await Promise.all(
      course.enrollments.map(async (enrollment) => {
        const computedGrade = await computeStudentGrade(enrollment.studentId, courseId);
        return {
          ...enrollment.student,
          totalWeighted: computedGrade?.totalWeighted,
          letterGrade: computedGrade?.letterGrade,
          gpaPoints: computedGrade?.gpaPoints
        };
      })
    );

    // Calculate summary statistics
    const validGrades = studentsWithGrades.filter(s => s.totalWeighted !== undefined);
    const average = validGrades.length > 0
      ? validGrades.reduce((sum, s) => sum + s.totalWeighted!, 0) / validGrades.length
      : null;

    const passRate = validGrades.length > 0
      ? (validGrades.filter(s => s.totalWeighted! >= 50).length / validGrades.length) * 100
      : null;

    return NextResponse.json({
      course: {
        id: course.id,
        code: course.code,
        title: course.title,
        credits: course.credits
      },
      students: studentsWithGrades,
      summary: {
        totalStudents: studentsWithGrades.length,
        gradedStudents: validGrades.length,
        average,
        passRate
      }
    });

  } catch (error) {
    console.error('Error generating course report:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}