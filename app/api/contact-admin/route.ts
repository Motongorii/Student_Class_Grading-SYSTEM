import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { email, message } = await req.json();
  // TODO: Send message to admin (e.g., email, database, etc.)
  // For now, just respond OK
  return NextResponse.json({ success: true, message: 'Your message has been sent to the admin.' });
}
