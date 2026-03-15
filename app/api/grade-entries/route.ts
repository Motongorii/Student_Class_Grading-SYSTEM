import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/authOptions';

const prisma = new PrismaClient();

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

const gradeEntrySchema = z.object({
  assessmentId: z.string().min(1),
  studentId: z.string().min(1),
  marks: z.number().min(0),
  status: z.enum(['DRAFT', 'SUBMITTED', 'APPROVED']).default('SUBMITTED'),
});

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Optionally filter by assessmentId or studentId
  const { searchParams } = new URL(req.url);
  const assessmentId = searchParams.get('assessmentId');
  const studentId = searchParams.get('studentId');
  const where: any = {};
  if (assessmentId) where.assessmentId = assessmentId;
  if (studentId) where.studentId = studentId;

  // If user is STUDENT, only show their own grades
  if (session.user.role === 'STUDENT') {
    const student = await prisma.student.findUnique({
      where: { email: session.user.email }
    });
    if (student) {
      where.studentId = student.id;
    }
  }

  // If user is INSTRUCTOR, only show grades for their courses
  if (session.user.role === 'INSTRUCTOR') {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        instructorCourses: {
          include: { course: true }
        }
      }
    });

    const courseIds = user?.instructorCourses.map(ci => ci.course.id) || [];
    if (courseIds.length > 0) {
      where.assessment = {
        courseId: { in: courseIds }
      };
    } else {
      // If instructor has no courses, return empty array
      return NextResponse.json([]);
    }
  }

  const entries = await prisma.gradeEntry.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { assessment: true, student: true },
  });
  return NextResponse.json(entries);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== 'INSTRUCTOR') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const body = await req.json();
  const parsed = gradeEntrySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
  }
  try {
    const entry = await prisma.gradeEntry.create({
      data: {
        assessment: { connect: { id: parsed.data.assessmentId } },
        student: { connect: { id: parsed.data.studentId } },
        marks: parsed.data.marks,
        status: parsed.data.status,
        createdByUser: { connect: { id: (session.user as any).id } },
      },
      include: { assessment: true, student: true },
    });
    return NextResponse.json(entry, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to create grade entry', details: e.message }, { status: 500 });
  }
}
