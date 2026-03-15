import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  // TODO: Generate reset token and send email
  // For now, just respond OK
  return NextResponse.json({ success: true, message: 'If this email exists, a reset link will be sent.' });
}
