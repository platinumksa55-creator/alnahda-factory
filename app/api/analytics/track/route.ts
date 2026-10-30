import { NextRequest, NextResponse } from 'next/server';
import { recordVisit } from '@/lib/analytics-store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { visitorId, path, referrer } = body;

    if (!visitorId || !path) {
      return NextResponse.json({ success: false, error: 'Missing visitorId or path' }, { status: 400 });
    }

    const userAgent = req.headers.get('user-agent') || '';
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || '127.0.0.1';

    await recordVisit({
      visitorId,
      path,
      referrer,
      userAgent,
      ip,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error tracking visit:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
