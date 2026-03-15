import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/authOptions';

const prisma = new PrismaClient();

const assessmentUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  weight: z.number().int().min(0).max(100).optional(),
  maxMarks: z.number().int().min(1).optional()
});

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== 'INSTRUCTOR' && session.user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const assessment = await prisma.assessment.findUnique({ where: { id: params.id } });
  if (!assessment) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(assessment);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'INSTRUCTOR') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const body = await req.json();
  const parsed = assessmentUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
  }
  try {
    const assessment = await prisma.assessment.update({ where: { id: params.id }, data: parsed.data });
    // TODO: Add audit log
    return NextResponse.json(assessment);
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to update assessment', details: e.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  return PUT(req, { params });
}
