import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/authOptions';

const prisma = new PrismaClient();

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

const courseSchema = z.object({
  code: z.string().min(1),
  title: z.string().min(1),
  credits: z.number().int().min(1)
});

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'REGISTRAR' && session.user.role !== 'INSTRUCTOR')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let courses;
  if (session.user.role === 'INSTRUCTOR') {
    // For instructors, only return courses they are assigned to
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { instructorCourses: { include: { course: true } } }
    });
    courses = user?.instructorCourses.map(ic => ic.course) || [];
  } else {
    // For admin and registrar, return all courses
    courses = await prisma.course.findMany({ orderBy: { createdAt: 'desc' } });
  }

  return NextResponse.json(courses);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const body = await req.json();
  const parsed = courseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
  }
  try {
    const course = await prisma.course.create({
      data: {
        code: parsed.data.code,
        title: parsed.data.title,
        credits: parsed.data.credits,
      },
    });
    // TODO: Add audit log
    return NextResponse.json(course, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to create course', details: e.message }, { status: 500 });
  }
}
