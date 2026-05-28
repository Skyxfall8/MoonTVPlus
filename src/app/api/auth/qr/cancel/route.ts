import { NextRequest, NextResponse } from 'next/server';

import { getQrLoginSession } from '@/lib/qr-login/store';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const { token } = await request.json();
  const session = getQrLoginSession(token);
  if (session) session.status = 'cancelled';
  return NextResponse.json({ ok: true });
}
