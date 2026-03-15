import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/authOptions';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'REGISTRAR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get comprehensive system report
    const faculties = await prisma.faculty.findMany({
      include: {
        courses: {
          include: {
            instructors: { include: { instructor: true } },
            assessments: true,
            enrollments: { include: { student: true } },
            computedGrades: { include: { student: true } }
          }
        },
        users: { where: { role: 'INSTRUCTOR' } }
      }
    });

    // Generate faculty summaries
    const facultyReports = faculties.map((faculty) => {
      let totalStudents = 0;
      let totalCourses = 0;
      let averageGPA = 0;
      let passCount = 0;

      const courseReports = faculty.courses.map((course) => {
        const enrolledStudents = course.enrollments.length;
        totalStudents += enrolledStudents;
        totalCourses++;

        const gradeData = course.computedGrades || [];
        const courseAverage = gradeData.length > 0
          ? gradeData.reduce((sum, g) => sum + (g.totalWeighted || 0), 0) / gradeData.length
          : 0;

        const coursePassCount = gradeData.filter(g => (g.totalWeighted || 0) >= 50).length;
        passCount += coursePassCount;

        return {
          code: course.code,
          title: course.title,
          credits: course.credits,
          instructor: course.instructors?.[0]?.instructor?.name || 'Unassigned',
          enrolledStudents,
          assessments: course.assessments.length,
          averageScore: courseAverage.toFixed(2),
          passRate: enrolledStudents > 0 ? ((coursePassCount / enrolledStudents) * 100).toFixed(1) : '0'
        };
      });

      averageGPA = courseReports.length > 0
        ? courseReports.reduce((sum, c) => sum + parseFloat(c.averageScore), 0) / courseReports.length
        : 0;

      return {
        facultyName: faculty.name,
        facultyCode: faculty.code,
        description: faculty.description,
        totalCourses,
        totalInstructors: faculty.users.length,
        totalStudents,
        averageGPA: averageGPA.toFixed(2),
        overallPassRate: totalStudents > 0 ? ((passCount / totalStudents) * 100).toFixed(1) : '0',
        courses: courseReports
      };
    });

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      totalFaculties: faculties.length,
      faculties: facultyReports,
      summary: {
        totalStudents: faculties.reduce((sum, f) => sum + f.courses.reduce((courseSum, c) => courseSum + c.enrollments.length, 0), 0),
        totalCourses: faculties.reduce((sum, f) => sum + f.courses.length, 0),
        totalInstructors: faculties.reduce((sum, f) => sum + f.users.length, 0)
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to generate report', details: error.message },
      { status: 500 }
    );
  }
}
