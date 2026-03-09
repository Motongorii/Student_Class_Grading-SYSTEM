import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/authOptions';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'REGISTRAR')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const faculties = await prisma.faculty.findMany({
      include: {
        courses: {
          include: {
            instructors: { include: { instructor: true } },
            assessments: true,
            enrollments: true
          }
        },
        users: { where: { role: 'INSTRUCTOR' } }
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(faculties);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch faculties', details: error.message },
      { status: 500 }
    );
  }
}
