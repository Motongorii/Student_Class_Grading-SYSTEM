import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/authOptions';

const prisma = new PrismaClient();

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

const assessmentSchema = z.object({
  courseId: z.string().min(1),
  name: z.string().min(1),
  weight: z.number().int().min(0).max(100),
  maxMarks: z.number().int().min(1)
});

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== 'INSTRUCTOR' && session.user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let assessments;
  if (session.user.role === 'INSTRUCTOR') {
    // For instructors, only return assessments for their courses
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        instructorCourses: {
          include: {
            course: {
              include: { assessments: true }
            }
          }
        }
      }
    });

    // Get assessments from all instructor's courses
    const assessmentList = [];
    for (const courseInstructor of user?.instructorCourses || []) {
      assessmentList.push(...courseInstructor.course.assessments);
    }
    assessments = assessmentList;
  } else {
    // For admin, return all assessments
    assessments = await prisma.assessment.findMany({ orderBy: { name: 'asc' } });
  }

  return NextResponse.json(assessments);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'INSTRUCTOR') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const body = await req.json();
  const parsed = assessmentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
  }

  // Validate that the instructor is assigned to this course
  const { courseId } = parsed.data;
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      instructorCourses: {
        where: { courseId }
      }
    }
  });

  if (!user || user.instructorCourses.length === 0) {
    return NextResponse.json({ error: 'You are not assigned to this course' }, { status: 403 });
  }

  // (Removed validation for total weights exceeding 100%)
  try {
    const assessment = await prisma.assessment.create({
      data: {
        courseId: parsed.data.courseId,
        name: parsed.data.name,
        weight: parsed.data.weight,
        maxMarks: parsed.data.maxMarks,
      },
    });
    // TODO: Add audit log
    return NextResponse.json(assessment, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to create assessment', details: e.message }, { status: 500 });
  }
}
